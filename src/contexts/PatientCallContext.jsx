import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import apiClient from "../api/client";

const PatientCallContext = createContext();

const STORAGE_KEY = "activeReceptionId";

export function PatientCallProvider({ children }) {
  const [callData, setCallData] = useState(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [activeReceptionId, setActiveReceptionId] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored) : null;
  });

  // 활성 접수 등록
  const registerReception = useCallback((receptionId) => {
    console.log("📝 접수 ID 등록:", receptionId);
    setActiveReceptionId(receptionId);
    localStorage.setItem(STORAGE_KEY, receptionId.toString());
  }, []);

  // 접수 해제
  const unregisterReception = useCallback(() => {
    console.log("📝 접수 ID 해제");
    setActiveReceptionId(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // 환자 호출 처리
  const handlePatientCall = useCallback((data) => {
    console.log("📢 환자 호출 - 모달 표시:", data);
    setCallData(data);
    setIsCallModalOpen(true);
  }, []);

  // 모달 닫기
  const closeCallModal = useCallback(() => {
    console.log("❌ 호출 모달 닫기");
    setIsCallModalOpen(false);
    setCallData(null);
  }, []);

  // 전역 Polling - 앱 어디서든 호출 감지
  useEffect(() => {
    if (!activeReceptionId) {
      console.log("⚠️ activeReceptionId 없음, Polling 시작 안함");
      return;
    }

    console.log("🔄 Polling 시작 - 접수 ID:", activeReceptionId);

    const checkPatientCall = async () => {
      try {
        const response = await apiClient.get(
          `/waiting/reception/${activeReceptionId}`
        );

        console.log("📡 호출 확인 응답:", response.data);

        if (response.data?.isSuccess && response.data?.data) {
          const waitingData = response.data.data;

          // CALLED 상태 확인
          if (waitingData.status === "CALLED") {
            console.log("🔔 환자 호출 감지!", waitingData);

            handlePatientCall({
              queueNo: waitingData.queueNo,
              doctorName: waitingData.doctorName || "담당 의사",
              departmentName: waitingData.departmentName || "진료과",
              roomNumber: waitingData.roomNumber || "진료실",
            });

            // 호출 후 polling 중지
            unregisterReception();
          }
        }
      } catch (error) {
        console.error("❌ 호출 확인 실패:", error);
      }
    };

    // 5초마다 확인
    const interval = setInterval(checkPatientCall, 5000);

    // 초기 1회 즉시 실행
    checkPatientCall();

    return () => {
      console.log("🔄 Polling 중지");
      clearInterval(interval);
    };
  }, [activeReceptionId, handlePatientCall, unregisterReception]);

  return (
    <PatientCallContext.Provider
      value={{
        callData,
        isCallModalOpen,
        handlePatientCall,
        closeCallModal,
        registerReception,
        unregisterReception,
        activeReceptionId,
      }}
    >
      {children}
    </PatientCallContext.Provider>
  );
}

export const usePatientCall = () => {
  const context = useContext(PatientCallContext);
  if (!context) {
    throw new Error("usePatientCall must be used within PatientCallProvider");
  }
  return context;
};
