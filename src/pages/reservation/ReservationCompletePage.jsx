import { useLocation } from "react-router-dom";
import Header from "../../components/layout/Header";
import BottomNav from "../../components/layout/BottomNav";
import ReservationComplete from "../../components/common/ReservationComplete";

export default function ReservationCompletePage() {
  const location = useLocation();
  const completeData = location.state?.data; // ✅ 이미 완성된 데이터 구조

  // completeData 구조:
  // {
  //   reservationId: 59,
  //   reservationNo: "RES-20251118-059",
  //   departmentName: "내과",
  //   doctorName: "김철수",
  //   appointmentDate: "2025-11-20", // YYYY-MM-DD
  //   appointmentTime: "09:00" // HH:MM
  // }

  return (
    <div className="flex flex-col min-h-screen max-w-[393px] mx-auto bg-white">
      <Header title="예약 완료" showBack={false} />

      <main className="flex-1 overflow-y-auto pb-24">
        <ReservationComplete type="reservation" data={completeData} />
      </main>

      <BottomNav />
    </div>
  );
}
