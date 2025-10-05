import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import HeroSection from "./components/HeroSection";
import WhoWeAre from "./components/WhoWeAre";
import StatsSection from "./components/StatsSection";
import WeProvide from "./components/WeProvide";
import ProductsSection from "./components/ProductsSection";
import OurValues from "./components/OurValues";
import ClientsSection from "./components/ClientsSection";
import SiteNotice from "./components/SiteNotice";

// pages
import ProductsPage from "./pages/ProductsPage";
import ContactPage from "./pages/ContactPage";
import GalleryPage from "./pages/GalleryPage";   
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./adminpage/AdminDashboard";

import ProtectedRoute from "./auth/ProtectedRoute";

const Home: React.FC = () => (
  <>
    <SiteNotice />
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
  const location = useLocation();
  const showHeader =
    !(
      location.pathname === "/admin" ||
      location.pathname.startsWith("/admin/")
    ) || location.pathname === "/admin/login";

  return (
    <>
      {showHeader && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/gallery" element={<GalleryPage />} /> 
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;

// made by TAC
