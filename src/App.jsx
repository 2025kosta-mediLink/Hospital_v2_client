import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import ConsentPage from "./pages/auth/ConsentPage";
import SignUpPage from "./pages/auth/SignUpPage";
import SignUpDonePage from "./pages/auth/SignUpDonePage";
import DepartmentSelectPage from "./pages/hospital/DepartmentSelectPage";
import DoctorSelectPage from "./pages/hospital/DoctorSelectPage";
import DateTimeSelectPage from "./pages/reservation/DateTimeSelectPage";
import ReservationCompletePage from "./pages/reservation/ReservationCompletePage";
import ReservationListPage from "./pages/reservation/ReservationListPage";
import ReceptionListPage from "./pages/reception/ReceptionListPage";
import PrescriptionPage from "./pages/prescription/PrescriptionPage";
import PharmacySearchPage from "./pages/pharmacy/PharmacySearchPage";
import DispensingStatusPage from "./pages/dispensing/DispensingStatusPage";
import SymptomSelectPage from "./pages/reception/SymptomSelectPage";
import ReceptionCompletePage from "./pages/reception/ReceptionCompletePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/consent" element={<ConsentPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/signup/done" element={<SignUpDonePage />} />
      <Route
        path="/reservation/departments"
        element={<DepartmentSelectPage />}
      />
      <Route path="/reception/departments" element={<DepartmentSelectPage />} />
      <Route path="/reservation/doctors" element={<DoctorSelectPage />} />
      <Route path="/reception/doctors" element={<DoctorSelectPage />} />
      <Route path="/reservation/datetime" element={<DateTimeSelectPage />} />
      <Route path="/reception/symptom" element={<SymptomSelectPage />} />
      <Route
        path="/reservation/complete"
        element={<ReservationCompletePage />}
      />
      <Route path="/reception/complete" element={<ReceptionCompletePage />} />{" "}
      <Route path="/reservation/list" element={<ReservationListPage />} />
      <Route path="/reception/list" element={<ReceptionListPage />} />
      <Route path="/prescription" element={<PrescriptionPage />} />
      <Route path="/pharmacy" element={<PharmacySearchPage />} />
      <Route path="/dispensing" element={<DispensingStatusPage />} />
    </Routes>
  );
}

export default App;
