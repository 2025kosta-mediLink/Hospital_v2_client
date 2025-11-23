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
    setActiveReceptionId(receptionId);
    localStorage.setItem(STORAGE_KEY, receptionId.toString());
  }, []);

  // 접수 해제
  const unregisterReception = useCallback(() => {
    setActiveReceptionId(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // 환자 호출 처리
  const handlePatientCall = useCallback((data) => {
    setCallData(data);
    setIsCallModalOpen(true);
  }, []);

  // 모달 닫기
  const closeCallModal = useCallback(() => {
    setIsCallModalOpen(false);
    setCallData(null);
  }, []);

  // 전역 Polling - 앱 어디서든 호출 감지
  useEffect(() => {
    if (!activeReceptionId) {
      return;
    }

    const checkPatientCall = async () => {
      try {
        const response = await apiClient.get(
          `/waiting/reception/${activeReceptionId}`
        );

        if (response.data?.isSuccess && response.data?.data) {
          const waitingData = response.data.data;

          // CALLED 상태 확인
          if (waitingData.status === "CALLED") {
            handlePatientCall({
              queueNo: waitingData.queueNo,
              doctorName: waitingData.doctorName || "담당 의사",
              departmentName: waitingData.departmentName || "진료과",
              roomNumber: waitingData.roomNumber || "1번 진료실",
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
