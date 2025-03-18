import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./assets/css/App.css"; // Fixed import path
import { Navbar } from "./components/Navbar";
import About from "./pages/About";
import Accessory from "./pages/Accessory";
import AccessoryDetail from "./pages/AccessoryDetail"; // ✅ Thêm lại AccessoryDetail
import AccessoryManagement from "./pages/accessory_management";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ViewScreen from "./pages/ViewScreen";
import Register from "./pages/Register";
import Tradelist from "./pages/Tradelist";
import UserManagement from "./pages/user_management";
import Checkout from "./pages/Checkout";

function App() {
  const location = useLocation();

  return (
    <div className="App">
      {/* Only show Navbar if the path is not login or register */}
      {location.pathname !== "/login" && location.pathname !== "/register" && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/tradelist" element={<Tradelist />} />
        <Route path="/accessory" element={<Accessory />} />
        <Route path="/accessory/:id" element={<AccessoryDetail />} /> {/* Fixed path to handle accessory ID */}
        <Route path="/login" element={<Login hideNavBar={true} />} />
        <Route path="/register" element={<Register hideNavBar={true} />} />
        <Route path="/user_management" element={<UserManagement />} />
        <Route path="/accessory_management" element={<AccessoryManagement />} />
        <Route path="/product/:id" element={<ViewScreen />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </div>
  );
}

export default App;
