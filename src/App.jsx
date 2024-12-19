import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import CountryComparisonForm from "./pages/CountryComparisonForm";
import CountryComparison from "./pages/CountryComparison";
import NewsPage from "./pages/NewsPage";

function App() {
  return (
    <div className="App">
      {/* Navbar */}
      <Navbar />
      {/* Main Content */}
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/compare" element={<CountryComparisonForm />} />
          <Route path="/comparison" element={<CountryComparison />} />
          <Route path="/news" element={<NewsPage />} />
          {/* Fallback Route */}
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
