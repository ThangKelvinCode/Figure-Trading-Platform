
import { Route, Routes } from "react-router-dom";
import './App.css';
import { Navbar } from "./components/Navbar";
import About from './components/pages/About';
import Contact from './components/pages/Contact';
import Home from "./components/pages/Home";
import { Services } from './components/pages/Services';
import PaymentSuccess from "./components/pages/PaymentSucess";
function App() {

  return<div className="App">
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
    <Route path="/about" element={<About/>}/>
      <Route path="/contact" element={<Contact/>}/>
      <Route path="/services" element={<Services />}/>
      <Route path="/paymentsucess" element={<PaymentSuccess />} />

    </Routes>   
    </div>
  
}

export default App
