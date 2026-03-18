import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import './App.css';
import Home from './pages/Home';
import Service from './pages/Service';
import Login from "./components/Login/Login";
import Register from "./components/Login/Register";
import Contact from "./pages/Contact";
import Feedback from "./components/Feedback/Feedback";
import Schemes from "./pages/Scheme";
import FarmingTips from "./pages/FarmingTips";
import Marketplace from "./pages/MarketPlace";
import Product from "./pages/Product";
import PrivacyPolicy from "./components/Term/PrivacyPolicy";
import TermsConditions from "./components/Term/TermsConditions";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Service />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* Add this line for Register page */}
        <Route path="/contact" element={<Contact />} /> {/* Add this line for Contact page */}
        <Route path="/feedback" element={<Feedback />} /> {/* Add this line for Feedback page */}
        <Route path="/schemes" element={<Schemes />} /> {/* Add this line for Schemes page */}
        <Route path="/tips" element={<FarmingTips />} /> {/* Add this line for Farming Tips page */}
        <Route path="/marketplace" element={<Marketplace />} /> {/* Add this line for Marketplace page */}
        <Route path="/product/:id" element={<Product />} /> {/* Add this line for Product Detail page */}
        <Route path="/privacy" element={<PrivacyPolicy />} /> {/* Add this line for Privacy Policy page */}
        <Route path="/terms" element={<TermsConditions />} /> {/* Add this line for Terms & Conditions page */}
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
