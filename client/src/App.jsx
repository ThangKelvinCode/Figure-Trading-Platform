import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./assets/css/App.css"; // Fixed import path
import { Navbar } from "./components/Navbar";
import About from "./pages/About";
import Accessory from "./pages/Accessory";
import AccessoryDetail from "./pages/AccessoryDetail"; // ✅ Thêm lại AccessoryDetail
import AccessoryManagement from "./pages/accessory_management";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tradelist from "./pages/Tradelist";
import UserManagement from "./pages/user_management";
import Checkout from "./pages/Checkout";
import UploadImage from "./pages/UploadImage";
import PaymentResult from "./components/PaymentResult";

function App() {
  const location = useLocation();

  return (
    <div className="App">
      {location.pathname !== "/login" && location.pathname !== "/register" && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/tradelist" element={<Tradelist />} />
        <Route path="/accessory" element={<Accessory />} />
        <Route path="/accessory/:id" element={<AccessoryDetail />} /> {/* ✅ Thêm lại route này */}
        <Route path="/login" element={<Login hideNavBar={true} />} />
        <Route path="/register" element={<Register hideNavBar={true} />} />
        <Route path="/user_management" element={<UserManagement />} />
        <Route path="/accessory_management" element={<AccessoryManagement />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/uploaditem" element={<UploadImage />} />
        <Route path="/payment-result" element={<PaymentResult />} />
      </Routes>
    </div>
  );
}

export default App;
