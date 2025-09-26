import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import HeroSection from "./components/HeroSection";
import WhoWeAre from "./components/WhoWeAre";
import StatsSection from "./components/StatsSection";
import WeProvide from "./components/WeProvide";
import ProductsSection from "./components/ProductsSection";
import OurValues from "./components/OurValues";
import ClientsSection from "./components/ClientsSection";

// pages
import ProductsPage from "./pages/ProductsPage";
import ContactPage from "./pages/ContactPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

const Home: React.FC = () => (
  <>
    <HeroSection />
    <WhoWeAre />
    <StatsSection />
    <WeProvide />
    <ProductsSection /> 
    <ClientsSection /> 
    <OurValues />
  </>
);

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin/login" element={<AdminLogin/>} />
        <Route path="/admin" element={<AdminDashboard/>} />
        {/* Optional: catch-all to Home or a 404 */}
        {/* <Route path="*" element={<Home/>} /> */}
      </Routes>

      <Footer />
    </>
  );
}

export default App;

// made by TAC
