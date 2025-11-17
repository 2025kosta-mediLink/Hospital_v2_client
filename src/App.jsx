import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import ConsentPage from "./pages/auth/ConsentPage";
import SignUpPage from "./pages/auth/SignUpPage";
import PrescriptionPage from "./pages/prescription/PrescriptionPage";
import PharmacySearchPage from "./pages/pharmacy/PharmacySearchPage";
import DispensingStatusPage from "./pages/dispensing/DispensingStatusPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/consent" element={<ConsentPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/prescription" element={<PrescriptionPage />} />
      <Route path="/pharmacy" element={<PharmacySearchPage />} />
      <Route path="/dispensing" element={<DispensingStatusPage />} />
    </Routes>
  );
}

export default App;
