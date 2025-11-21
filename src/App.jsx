import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
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
import TodayReservationPage from "./pages/reservation/TodayReservationPage";
import ReceptionListPage from "./pages/reception/ReceptionListPage";
import PrescriptionPage from "./pages/prescription/PrescriptionPage";
import PrescriptionDetailPage from "./pages/prescription/PrescriptionDetailPage";
import PharmacySearchPage from "./pages/pharmacy/PharmacySearchPage";
import DispensingStatusPage from "./pages/dispensing/DispensingStatusPage";
import SymptomSelectPage from "./pages/reception/SymptomSelectPage";
import ReceptionCompletePage from "./pages/reception/ReceptionCompletePage";
import GlobalDispensingNotification from "./components/dispensing/GlobalDispensingNotification";

function App() {
  return (
    <>
      {/* 전역 조제 완료 알림 */}
      <GlobalDispensingNotification />
      <Routes>
      {/* 인증 불필요 페이지 */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/consent" element={<ConsentPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/signup/done" element={<SignUpDonePage />} />

      {/* 인증 필요 페이지 */}
      <Route
        path="/reservation/departments"
        element={
          <ProtectedRoute>
            <DepartmentSelectPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reservation/today"
        element={
          <ProtectedRoute>
            <TodayReservationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reception/departments"
        element={
          <ProtectedRoute>
            <DepartmentSelectPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reservation/doctors"
        element={
          <ProtectedRoute>
            <DoctorSelectPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reception/doctors"
        element={
          <ProtectedRoute>
            <DoctorSelectPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reservation/datetime"
        element={
          <ProtectedRoute>
            <DateTimeSelectPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reception/symptom"
        element={
          <ProtectedRoute>
            <SymptomSelectPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reception/complete"
        element={
          <ProtectedRoute>
            <ReceptionCompletePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reservation/complete"
        element={
          <ProtectedRoute>
            <ReservationCompletePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reservation/list"
        element={
          <ProtectedRoute>
            <ReservationListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reception/list"
        element={
          <ProtectedRoute>
            <ReceptionListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/prescription"
        element={
          <ProtectedRoute>
            <PrescriptionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/prescription/:prescriptionId"
        element={
          <ProtectedRoute>
            <PrescriptionDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pharmacy"
        element={
          <ProtectedRoute>
            <PharmacySearchPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dispensing"
        element={
          <ProtectedRoute>
            <DispensingStatusPage />
          </ProtectedRoute>
        }
      />
    </Routes>
    </>
  );
}

export default App;
