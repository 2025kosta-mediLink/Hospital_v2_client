import { useLocation } from "react-router-dom";
import Header from "../../components/layout/Header";
import BottomNav from "../../components/layout/BottomNav";
import ReservationComplete from "../../components/common/ReservationComplete";

export default function ReceptionCompletePage() {
  const location = useLocation();
  const receptionData = location.state?.data;
  const queueNo = location.state?.queueNo; // 대기번호 추가

  const completeData = {
    reservationNo: receptionData?.receptionNo,
    departmentName: receptionData?.departmentName,
    doctorName: receptionData?.doctorName,
    symptom: receptionData?.symptom || "증상 미기재",
    queueNo: queueNo, // 대기번호 추가
  };

  return (
    <div className="flex flex-col min-h-screen max-w-[393px] mx-auto bg-white">
      <Header showBack={false} />

      <main className="flex-1 overflow-y-auto">
        <ReservationComplete type="reception" data={completeData} />
      </main>

      <BottomNav />
    </div>
  );
}
