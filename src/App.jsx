import "./App.css";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import PrescriptionPage from "./pages/prescription/PrescriptionPage";
import PharmacySearchPage from "./pages/pharmacy/PharmacySearchPage";
import DispensingStatusPage from "./pages/dispensing/DispensingStatusPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/prescription" element={<PrescriptionPage />} />
      <Route path="/pharmacy" element={<PharmacySearchPage />} />
      <Route path="/dispensing" element={<DispensingStatusPage />} />
    </Routes>
  );
}

export default App;
