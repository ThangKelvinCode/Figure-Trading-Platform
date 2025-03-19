
import { Route, Routes } from "react-router-dom";
import './App.css';
import { Navbar } from "./components/Navbar";
import About from './components/pages/About';
import Contact from './components/pages/Contact';
import Home from "./components/pages/Home";
import { Services } from './components/pages/Services';
import PaymentSuccess from "./components/pages/PaymentSucess";
import PaymentProcessing from "./components/pages/PaymentProcessing";
import PaymentFailure from "./components/pages/PaymentFailure";
function App() {

  return<div className="App">
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
    <Route path="/about" element={<About/>}/>
      <Route path="/contact" element={<Contact/>}/>
      <Route path="/services" element={<Services />}/>
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-failure" element={<PaymentFailure />} />
      <Route path="/payment-process" element={<PaymentProcessing />} />
    </Routes>   
    </div>
  
}

export default App
