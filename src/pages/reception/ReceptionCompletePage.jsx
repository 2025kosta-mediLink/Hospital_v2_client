import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "../../components/layout/Header";
import BottomNav from "../../components/layout/BottomNav";
import ReservationComplete from "../../components/common/ReservationComplete";
import { usePatientCall } from "../../contexts/PatientCallContext";

export default function ReceptionCompletePage() {
  const location = useLocation();
  const receptionData = location.state?.data;
  const queueNo = location.state?.queueNo;
  const receptionId = location.state?.receptionId;

  const { registerReception } = usePatientCall();

  // 접수 ID 등록 (polling 시작)
  useEffect(() => {
    if (receptionId) {
      registerReception(receptionId);
    } else {
      console.error("❌ receptionId를 찾을 수 없습니다!");
    }
  }, [receptionId, registerReception]);

  const completeData = {
    reservationNo: receptionData?.receptionNo,
    departmentName: receptionData?.departmentName,
    doctorName: receptionData?.doctorName,
    symptom: receptionData?.symptom || "증상 미기재",
    queueNo: queueNo,
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
