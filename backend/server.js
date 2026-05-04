import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import app from "./src/app.js";
import seedServicesAndSchemes from "./src/utils/seedServicesAndSchemes.js";

dotenv.config();

// Step 1: connect DB
await connectDB();

// Step 2: seed services and schemes if empty
await seedServicesAndSchemes();

// Step 3: start server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
