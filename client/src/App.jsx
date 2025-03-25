import { Route, Routes, useLocation } from "react-router-dom";
import "./assets/css/App.css"; // Fixed import path
import { Navbar } from "./components/Navbar";
import About from "./pages/About";
import Accessory from "./pages/Accessory";
import AccessoryManagement from "./pages/accessory_management";
import AccessoryDetail from "./pages/AccessoryDetail"; // ✅ Thêm lại AccessoryDetail
import AuthPage from "./pages/AuthPage";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import Offer from "./pages/Offer";
import Tradelist from "./pages/Tradelist";
import UserManagement from "./pages/user_management";
import ViewScreen from "./pages/ViewScreen";
import PaymentSuccess from "./pages/PaymentSucess";
import PaymentFailure from "./pages/PaymentFailure";
import PaymentProcessing from "./components/PaymentProcessing";
import TradeRequestDetail from "./pages/TradeRequestDetail";
import MyOffers from "./pages/MyOffers";

import BillingInfo from "./pages/BillingInfo";


function App() {
  const location = useLocation();

  return (
    <div className="App">
      {/* Only show Navbar if the path is not login or register */}
      {location.pathname !== "/authpage" && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/tradelist" element={<Tradelist />} />
        <Route path="/accessory" element={<Accessory />} />
        <Route path="/accessory/:id" element={<AccessoryDetail />} />{" "}
        <Route path="/user_management" element={<UserManagement />} />
        <Route path="/accessory_management" element={<AccessoryManagement />} />
        <Route path="/product/:id" element={<ViewScreen />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/offer" element={<Offer />} />
        <Route path="/my-offers" element={<MyOffers />} />
        <Route path="/trade_request/:requestId" element={<TradeRequestDetail />} />
        <Route path="/authpage" element={<AuthPage hideNavBar={true} />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failure" element={<PaymentFailure />} />
        <Route path="/payment-process" element={<PaymentProcessing />} />
        <Route path="/billinginfo" element={<BillingInfo />} />
      </Routes>
    </div>
  );
}

export default App;
