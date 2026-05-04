# AgroFresh — Developer Handover Guide

A direct farmer-to-customer agricultural marketplace. Yeh document poori platform ka overview, setup steps, API list, aur har feature ka test flow cover karta hai.

---

## 1. Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite + React Router |
| Backend | Node.js + Express 5 |
| Database | MongoDB + Mongoose |
| Auth | JWT (Bearer token in `Authorization` header) |
| File Uploads | Multer (local disk → `backend/uploads/`) |
| Email | Nodemailer + Gmail SMTP |
| Styling | Plain CSS per page/component |

---

## 2. Setup (new machine)

```
git clone <repo>
cd AgroFresh

# Backend
cd backend
npm install
# create .env (see section 3)
npm run dev          # runs server.js with nodemon

# Frontend (separate terminal)
cd ../frontend
npm install
npm run dev          # vite dev server on http://localhost:5173
```

Backend → `http://localhost:5000`. MongoDB local instance on default port (`mongodb://127.0.0.1:27017/agrofresh`).

---

## 3. Environment Variables (`backend/.env`)

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/agrofresh
JWT_SECRET=<any_random_string>
JWT_EXPIRE=30d

# Email (optional — agar set nahi hua to mailer silently skip karta hai)
EMAIL_USER=khushinema22@gmail.com
EMAIL_PASS=<gmail_app_password_16_chars>

# Cloudinary (currently unused but reserved)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**Gmail App Password lena hai** → 2FA ON karke `myaccount.google.com/apppasswords`.

`.env` already gitignored hai — secrets safe rahenge.

---

## 4. Folder Structure (high level)

```
backend/
├── server.js                       # entry: connect DB → seed → app.listen
├── uploads/                        # multer drops product images/videos here
└── src/
    ├── app.js                      # express middleware + route mounting
    ├── config/db.js                # mongoose connect
    ├── middleware/
    │   ├── authMiddleware.js       # `protect` (JWT verify) + role guards
    │   ├── isAdmin.js              # admin gate
    │   └── upload.js               # multer config (50MB, image+video)
    ├── models/                     # Mongoose schemas (one per file)
    ├── controllers/                # business logic per domain
    ├── routes/                     # express routers (one per domain)
    └── utils/
        ├── mailer.js               # nodemailer wrapper (no-op if creds missing)
        └── seedServicesAndSchemes.js

frontend/src/
├── main.jsx                        # wraps app in <CartProvider> + <BrowserRouter>
├── App.jsx                         # all routes
├── context/CartContext.jsx         # cart state (localStorage + DB sync)
├── pages/                          # full pages (one per route)
└── components/                     # Navbar, Footer, Login, Feedback, About, etc.
```

---

## 5. Database Models (collections)

| Model | Key fields | Purpose |
|---|---|---|
| **User** | fullName, email, mobile, password (hashed), userType (`farmer`/`customer`/`admin`), address, location, verification.status, rating, totalReviews, bankDetails | Single users collection — role decided by `userType` |
| **Product** | name, price, stock, quantityUnit, category, description, images[], videos[], farmer (ref), rating, numReviews | Catalog. Farmer ke products. |
| **SellerVerification** | farmer (ref), farmName, farmLocation, farmSize, cropTypes[], bankDetails, status, adminNotes | Application Farmer apply karta hai → Admin approve/reject |
| **Cart** | user (ref, unique), items: [{product, quantity}] | Logged-in user ka persisted cart |
| **Order** | customer, farmer, products: [{product, quantity, price}], totalAmount, orderStatus, paymentStatus, paymentMethod, shippingAddress, notes | Ek order = ek farmer ke items only (split per farmer) |
| **Wishlist** | user (ref, unique), products: [refs] | Per-customer wishlist |
| **Review** | user, product, rating, comment | Product reviews → recompute product.rating + farmer.rating |
| **Service** | icon, title, desc, order | "What we offer" cards (admin-managed) |
| **Scheme** | type (`main`/`new`), title, category, description, benefit, deadline, status, icon, link, details, source | Government schemes (admin-managed) |
| **Feedback** | name, email, category, rating, message, userType, userId | "What People Say" + admin viewable |
| **ContactMessage** | name, email, subject, message, isRead | Contact form submissions |

---

## 6. Backend API Endpoints

Sare routes `app.js` me mount hote hain. Auth-required routes ke aage 🔒 hai. Admin-only ke aage 👑.

### Auth (`/api/auth`)
- `POST /register` — register new user
- `POST /login` — returns `{ token, user }`
- `GET /profile` 🔒 — current user details
- `PUT /profile` 🔒 — update own profile
- `PUT /change-password` 🔒

### Users (`/api/users`)
- `POST /upload-document` 🔒 — verification doc upload

### Admin (`/api/admin`) 🔒👑
- `GET /pending-farmers` — list pending farmer registrations
- `PUT /verify/:userId` — approve/reject farmer
- `GET /pending-verifications` — seller verification applications
- `PUT /process-verification/:applicationId` — approve/reject application

### Products (`/api/products`)
- `GET /` — all products (public)
- `POST /` 🔒 — add product (multer: `images[]`, `videos[]`, max 8 + 4, 50MB each). Only verified farmers
- `GET /:id` — single product (public, populates farmer)
- `GET /farmer/my-products` 🔒 — farmer's own products

### Reviews (`/api/reviews`)
- `GET /product/:productId` — public list
- `POST /product/:productId` 🔒 — create/update review (one per user per product). Recomputes product + farmer rating
- `DELETE /:id` 🔒 — own review or admin

### Cart (`/api/cart`) 🔒
- `GET /` — current cart (auto-creates empty if missing)
- `PUT /` — replace cart items (used by frontend on every change)
- `POST /merge` — merge guest cart with DB on login (max-quantity strategy)
- `DELETE /` — clear cart

### Orders (`/api/orders`) 🔒
- `POST /` — checkout. Validates stock → splits by farmer → creates 1 order per farmer → decrements stock → clears cart
- `GET /my` — customer's orders (populated)
- `GET /farmer` — farmer's incoming orders (alt: `GET /api/farmer/orders` already exists with custom formatting)
- `PUT /:id/status` — farmer/admin updates status. On `delivered` auto-marks `paymentStatus: paid`. On `cancelled` restores stock
- `PUT /:id/cancel` — customer cancels (only if not shipped)

### Wishlist (`/api/wishlist`) 🔒
- `GET /` — current user's wishlist (populated with product + farmer)
- `POST /` body `{productId}` — add (idempotent)
- `DELETE /:productId` — remove
- `DELETE /` — clear

### Services (`/api/services`)
- `GET /` — public list (used by Service page + Home carousel)
- `POST /` 🔒👑 — admin create
- `PUT /:id` 🔒👑 — admin edit
- `DELETE /:id` 🔒👑

### Schemes (`/api/schemes`)
- Same shape as services. `type=main` for cards, `type=new` for "Newly Announced" section

### Feedback (`/api/feedback`)
- `POST /` — submit (public, but auto-attaches userType if token present)
- `GET /?limit=N` — public list, only `rating>=4` (used by "What People Say")
- `GET /admin` 🔒👑 — all feedbacks
- `DELETE /:id` 🔒👑

### Contact (`/api/contact`)
- `POST /` — submit message (public). Saves to DB AND emails to `khushinema22@gmail.com` if mailer configured
- `GET /` 🔒👑 — admin list
- `PUT /:id/read` 🔒👑 — mark read
- `DELETE /:id` 🔒👑

### Stats (`/api/stats`)
- `GET /` — public counts: farmers, customers, products, services, schemes, farmingResources

### Farmer (`/api/farmer`) 🔒
- `GET /dashboard` — totals (orders, customers, earnings)
- `GET /products`, `GET /orders`, `GET /earnings`, `GET /ratings` — dashboard data
- `GET /verification-status` — apply status
- `POST /apply-verification` — submit seller verification application

---

## 7. Frontend Routes (`App.jsx`)

| Route | Page | Auth |
|---|---|---|
| `/` | Home (About + Hero + Stats + Carousel + Feedback) | public |
| `/services` | Service list | public |
| `/schemes` | Government schemes | public |
| `/marketplace` | Product grid + filters | public |
| `/product/:id` | Product detail (gallery, reviews, wishlist, buy) | public |
| `/contact` | Contact form | public |
| `/feedback` | Feedback form | public |
| `/tips` | Farming tips | public |
| `/login`, `/register` | Auth | public |
| `/cart` | Cart page | works for guests too |
| `/checkout` | Place order | redirects to login if guest |
| `/order-success` | Confirmation | requires order state |
| `/my-orders` | Customer's order history | login required |
| `/add-product` | Sell product form | farmer only (customer redirected) |
| `/farmer-dashboard` | Sidebar layout: Overview/Products/Orders/Earnings/Profile/Verification | farmer |
| `/customer-dashboard` | Sidebar layout: Overview/Orders/Wishlist/Profile/Addresses | customer |
| `/admin-dashboard` | Tabs: Farmers / Verifications / Services / Schemes / Messages | admin |
| `/privacy`, `/terms` | Legal pages | public |

---

## 8. Auth Flow

1. **Register** → `POST /api/auth/register` → returns `{token, user}`
2. **Login** → `POST /api/auth/login` → frontend stores `token`, `userType`, `userName`, `userId` in `localStorage`
3. After login → `mergeWithBackend()` sync hota hai (cart) — see CartContext
4. **Protected request** → frontend sends `Authorization: Bearer <token>`
5. Backend `protect` middleware verifies → attaches `req.user` (full Mongoose doc)
6. Role guards: `isAdmin`, `farmerOnly`, `customerOnly` (in middleware files)

**Three roles** (`User.userType`):
- `farmer` — sells products, has verification flow
- `customer` — buys, has cart/wishlist/orders
- `admin` — moderates everything

**Role enforcement on frontend:**
- Farmer trying to "Add to Cart" / "Buy Now" → friendly alert
- Customer hitting `/add-product` → redirect to marketplace with alert

---

## 9. Major Features — Test Flows

### 9.1 Registration + Verification (Farmer)

1. Register as `farmer` → status `pending`
2. Login → FarmerDashboard → apply seller verification (farm name, size, crops, bank details)
3. Admin login → Admin Dashboard → "Pending Farmers" or "Seller Verification" → Approve
4. Farmer reload → can now `Add Product`

### 9.2 Add Product

1. Farmer dashboard → "+ Add New Product" or `/add-product`
2. Form: name, price, stock, **Unit dropdown** (kg/litre/etc), **Category dropdown** (Vegetables/Fruits/etc), description, **multiple images**, **optional videos**
3. Submit → `POST /api/products` (multer FormData) → file URLs `http://localhost:5000/uploads/<filename>`
4. Marketplace → Product card visible. Click → detail page with image carousel + video play overlay

### 9.3 Cart + Buy Now (Customer)

1. **Guest user** → Add to Cart from product card → cart icon badge updates → `/cart` works without login
2. Click "Proceed to Checkout" → redirect to `/login`
3. After login → `mergeWithBackend()` runs → guest items + DB items merged (max-qty strategy)
4. `/checkout` → fill shipping + COD → "Place Order"
5. Backend splits cart by farmer → 1 Order per farmer → stock decrements → cart cleared
6. `/order-success` page → "View My Orders"

### 9.4 Order Lifecycle

- **Customer** `/my-orders` — shipping, items, total, payment method, ❤️ Contact Farmer button (`tel:` link), Cancel button (only if not shipped)
- **Farmer** dashboard → "Orders Received" — customer details, items with images, payment method, 📞 Contact Customer button, Status dropdown
- Status flow: `pending → processing → shipped → delivered`. On `delivered` → `paymentStatus = paid`. On `cancelled` → stock restored.

### 9.5 Reviews + Ratings

1. Customer on product page → ⭐ Rating + comment → Submit
2. Backend recomputes:
   - `Product.rating` + `Product.numReviews` from all reviews on that product
   - `User.rating` (farmer) — average of all reviews across **all** products by that farmer
3. One review per user per product (resubmit edits existing)
4. Marketplace card + product detail + farmer dashboard rating tab — sab automatically update

### 9.6 Wishlist

1. Customer → product page → 🤍 → ❤️ (instant toggle)
2. CustomerDashboard → Wishlist tab → grid with product image, farmer name, "View Product" / "Remove"
3. Farmer or guest clicking heart → friendly alert

### 9.7 Reviews & Feedback

- **Product reviews** (per product) → drives ratings
- **Site feedback** (`/feedback`) → goes to MongoDB → `rating>=4` shown on Home page "What People Say" carousel cards. Admin sees all in admin dashboard tab (currently view-only via `/api/feedback/admin`)

### 9.8 Contact Form

1. `/contact` → fill name, email, subject, message → Submit
2. Saves in `ContactMessage` collection
3. If mailer configured → email sent to `khushinema22@gmail.com` with `Reply-To: <visitor email>`
4. Admin Dashboard → "Contact Messages" tab → unread badge, reply button (mailto:), delete

### 9.9 Admin CMS

Admin Dashboard tabs:
- **Farmer Verification** — approve/reject farmer registrations
- **Seller Verification** — approve/reject seller applications
- **Manage Services** — add/edit/delete cards (live on Home + `/services`)
- **Manage Schemes** — same for government schemes
- **Contact Messages** — view/reply/delete

### 9.10 Home Page Dynamic Sections

- **Stats** (1000+, 5000+, etc.) ← `/api/stats` actual MongoDB counts (formatted: 1k+, 200+, etc.)
- **Platform Features carousel** ← `/api/services` (auto-rotates every 4s, prev/next, dot indicators)
- **What People Say** ← `/api/feedback?limit=6` (only rating ≥ 4)
- Mission/Vision are still static (intentional — not user-content)

---

## 10. Cart Sync — Important to understand

```
Guest user:
   localStorage <-> CartContext (instant UX)

Logged-in user:
   localStorage <-> CartContext <-> /api/cart (background sync on every change)

Login moment:
   1. Guest items already in localStorage
   2. POST /api/cart/merge { items } → backend max-qty merge with existing DB cart
   3. Response replaces local state → writeLocal()
```

**Source of truth during session = localStorage** (instant). DB is mirror for cross-device persistence.

---

## 11. Stock & Concurrency Notes

- Stock check in `createOrder` happens before any decrement
- `Product.findByIdAndUpdate(..., { $inc: { stock: -qty } })` is atomic per item (Mongo-level)
- Race condition possible if two customers checkout simultaneously for last unit — second will see negative stock for ~ms before next request fails. **Acceptable for v1**; can add session+transaction for v2.
- Cart `+` button capped at `product.stock` (frontend hint; real check is server-side)

---

## 12. Common Gotchas

- **Vite stuck error overlay**: Sometimes after a parse error, the overlay pins to old file content. Fix: `Ctrl+C` Vite → `Remove-Item -Recurse -Force frontend/node_modules/.vite` → `npm run dev`.
- **CSS leak across pages**: Earlier `Contact.css` and `Feedback.css` had unscoped `.form-group label { position: absolute }` which broke forms everywhere. Now scoped to `.contact-form` and `.feedback-form` respectively.
- **Mailer silent skip**: If `EMAIL_USER` is the placeholder string, contact form still saves message but skips email (you'll see `📭 Mailer not configured` in console).
- **Old orders without `paymentMethod`**: Schema field added later. Existing orders default to `cod` in UI via fallback.
- **Existing CSS inside `:root .form-group label` style is global**: Be careful adding global form rules; scope them.
- **Image URLs in DB are absolute (`http://localhost:5000/uploads/...`)**: When deploying, will need to be reconstructed dynamically OR migrate to Cloudinary.

---

## 13. Things Currently Static / TODO

- Mission, Vision, footer links — static text (intentional)
- Online payment (Razorpay) — UI placeholder, COD only is functional
- Cloudinary — dependency installed but not used; current setup uses local disk
- Customer "Settings" tab in dashboard — UI only, no real settings
- Customer addresses — only showing the user's single saved address. Multi-address book not built
- Farmer verification document upload route exists (`POST /api/users/upload-document`) but not wired into UI
- Email notifications on order events — not built (easy add via `mailer.js`)
- Admin orders overview — not built (only farmer/customer see orders); easy add

---

## 14. Test User Quick-Setup

Pehli baar local me running ke liye:

```
1. Register an admin manually in MongoDB (or via /api/auth/register and update userType='admin' in DB)
   → Easiest: register normally, then `db.users.updateOne({email: ...}, {$set: {userType: 'admin'}})`

2. Register one farmer + verify via admin
   → As farmer: apply seller verification → as admin: approve

3. Register one customer
   → Browse marketplace, add to cart, place COD order

4. Test review: customer reviews product → check farmer rating updates

5. Test contact form → check admin dashboard "Contact Messages" tab
```

---

## 15. Quick Restart Recipe

After pulling latest code:
```
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```

If something looks wrong:
- Backend not loading new route? Restart server (route registration happens on startup).
- Frontend showing stale code? Hard refresh (`Ctrl+Shift+R`). If still bad → kill Vite + clear `.vite` cache.
- DB queries returning empty? Check Mongo is running (`mongosh agrofresh` → `show collections`).
- 401 errors? Token expired (30d) — logout/login again.

---

## 16. Domain Map (mental model)

```
USERS ──┬── farmer ──> verifies ──> creates Products ──> receives Orders
        ├── customer ──> Cart ──> Order ──> Reviews + Wishlist
        └── admin ──> moderates everything (Services, Schemes, Verifications, Messages)

PRODUCT ──> reviews ──> rating roll-up to PRODUCT + USER(farmer)
        └─> stock ──> deducted on Order, restored on Cancel

ORDER ──> always has 1 farmer + 1 customer + N items from that 1 farmer
       └─> split logic in orderController.createOrder
```

Bas itna mental model laga lo, baki sab logically follow karega.

---

End of guide. Friend ko share karte time iske saath repo ka access aur ek seeded MongoDB dump bhi de dena (optional) — taaki seed data se directly play kar sake.
