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
    console.log("📋 전체 location.state:", location.state);
    console.log("📋 receptionData:", receptionData);
    console.log("📋 receptionId:", receptionId);

    if (receptionId) {
      registerReception(receptionId);
    } else {
      console.error("❌ receptionId를 찾을 수 없습니다!");
    }
  }, [receptionId, registerReception]);

  const completeData = {
    receptionNo: receptionData?.receptionNo, // 접수번호 표시
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

        {/* 대기 중 안내 */}
        <div className="px-4 py-3 mx-4 mt-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">
                호출을 기다리고 있습니다
              </p>
              <p className="text-xs text-blue-700 mt-1">
                호출되면 자동으로 알림이 표시됩니다
              </p>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
