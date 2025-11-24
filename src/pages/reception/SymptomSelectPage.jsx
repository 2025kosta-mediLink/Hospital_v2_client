import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import BottomNav from "../../components/layout/BottomNav";
import ReceptionConfirmModal from "../../components/reception/ReceptionConfirmModal";
import { getSymptoms } from "../../api/symptomApi";
import {
  createReception,
  createReceptionFromReservation,
  getReceptionDetail,
} from "../../api/receptionApi";

export default function SymptomSelectPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // 일반 접수용 props
  const { doctorId, doctorName, departmentName } = location.state || {};

  // 예약 기반 접수용 props
  const { reservationId, reservationNo, reservationTime, fromPage } =
    location.state || {};

  // 예약 기반 접수인지 확인
  const isReservationBased = !!reservationId;

  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [noteToDoctor, setNoteToDoctor] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const maxLength = 500;

  // 증상 목록 로드
  useEffect(() => {
    loadSymptoms();
  }, []);

  const loadSymptoms = async () => {
    setIsLoading(true);
    try {
      const result = await getSymptoms();

      if (result.isSuccess && result.data) {
        setSymptoms(result.data);
      } else if (Array.isArray(result)) {
        setSymptoms(result);
      } else if (result.data && Array.isArray(result.data)) {
        setSymptoms(result.data);
      } else {
        setSymptoms([]);
      }
    } catch (error) {
      console.error("증상 목록 로드 실패:", error);

      if (error.response?.status === 401) {
        alert("증상 목록 조회 권한이 없습니다. 백엔드 설정을 확인해주세요.");
      } else {
        alert("증상 목록을 불러오는데 실패했습니다.");
      }

      setSymptoms([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 증상 선택/해제
  const toggleSymptom = (symptomId) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId)
        ? prev.filter((id) => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  // 텍스트 입력 핸들러
  const handleNoteChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setNoteToDoctor(value);
    }
  };

  // "다음" 버튼 클릭 → 모달 열기
  const handleNext = (e) => {
    e.preventDefault();

    if (selectedSymptoms.length === 0) {
      alert("증상을 하나 이상 선택해주세요.");
      return;
    }

    if (noteToDoctor.length > maxLength) {
      alert(`전달사항은 최대 ${maxLength}자까지 입력 가능합니다.`);
      return;
    }

    setIsModalOpen(true);
  };

  // 모달에서 "바로 접수하기" 클릭 → 실제 API 호출
  const handleConfirmReception = async () => {
    try {
      let createResult;

      if (isReservationBased) {
        createResult = await createReceptionFromReservation({
          reservationId,
          symptomIds:
            selectedSymptoms.length > 0 ? selectedSymptoms : undefined,
          noteToDoctor: noteToDoctor.trim() || undefined,
          consentNotice: true,
        });
      } else {
        createResult = await createReception({
          doctorId,
          symptomIds:
            selectedSymptoms.length > 0 ? selectedSymptoms : undefined,
          noteToDoctor: noteToDoctor.trim() || undefined,
          consentNotice: true,
        });
      }

      if (createResult.isSuccess) {
        const receptionId =
          createResult.data?.receptionId ||
          createResult.data?.id ||
          createResult.data;

        const queueNo = createResult.data?.queueNo; // 대기번호 추출

        const detailResult = await getReceptionDetail(receptionId);

        if (detailResult.isSuccess) {
          setIsModalOpen(false);

          navigate("/reception/complete", {
            state: {
              receptionId, // receptionId 추가
              queueNo: queueNo, // 대기번호 전달
              type: isReservationBased ? "RESERVATION" : "NORMAL",
              fromPage: isReservationBased ? fromPage : undefined,
              data: {
                receptionId, // data 안에도 receptionId 추가
                receptionNo:
                  detailResult.data.receptionNo ||
                  `REC-${String(receptionId).padStart(3, "0")}`,
                departmentName:
                  detailResult.data.departmentName || departmentName,
                doctorName: detailResult.data.doctorName || doctorName,
                symptom:
                  detailResult.data.symptom ||
                  (selectedSymptoms.length > 0
                    ? symptoms
                        .filter((s) => selectedSymptoms.includes(s.symptomId))
                        .map((s) => s.name)
                        .join(", ")
                    : "증상 미기재"),
              },
            },
          });
        }
      }
    } catch (error) {
      console.error("접수 생성 실패:", error);

      if (error.response?.status === 401) {
        setIsModalOpen(false);
        alert("로그인이 필요합니다.");
        navigate("/login", {
          state: {
            from: location.pathname,
            returnState: location.state,
            message: "접수를 위해 로그인이 필요합니다.",
          },
        });
        return;
      }

      alert(error.message || "접수에 실패했습니다.");
      throw error;
    }
  };

  // 모달에 전달할 데이터 준비
  const receptionData = {
    departmentName,
    doctorName,
    symptoms:
      selectedSymptoms.length > 0
        ? symptoms
            .filter((s) => selectedSymptoms.includes(s.symptomId))
            .map((s) => s.name)
        : [],
    noteToDoctor: noteToDoctor.trim() || null,
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="relative flex min-h-screen w-full max-w-[393px] flex-col bg-white">
        {/* 헤더 - 고정 */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] z-50">
          <Header showBack={true} />
        </div>

        {/* 메인 영역 - 스크롤 가능 */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] pt-14 pb-[calc(64px+96px)]">
          <form id="symptomForm" onSubmit={handleNext} className="p-4">
            {/* 예약 정보 카드 - 예약 기반 접수인 경우에만 표시 */}
            {isReservationBased && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl shadow-sm p-3.5 mb-3">
                <h3 className="flex items-center gap-2 mb-2 text-sm font-semibold text-blue-900">
                  <img
                    src="/images/icons/calendar_blue.png"
                    alt="예약 정보"
                    className="h-5 w-5 object-contain"
                  />
                  예약 정보
                </h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>예약 번호: {reservationNo}</div>
                  <div>진료과: {departmentName}</div>
                  <div>의료진: {doctorName}</div>
                  {reservationTime && (
                    <div>
                      예약 시간:{" "}
                      {reservationTime.includes("T")
                        ? reservationTime.split("T")[1].substring(0, 5)
                        : reservationTime}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 카드 1: 증상 선택 */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-3.5 mb-3">
              <h3 className="flex items-center gap-2 mb-2.5 text-sm font-semibold text-gray-900">
                발생 증상 선택
                <span className="bg-blue-100 text-blue-700 rounded-full px-2.5 py-1 text-xs font-extrabold">
                  선택 {selectedSymptoms.length}개
                </span>
              </h3>

              {isLoading ? (
                <div className="my-6 py-[18px] border border-dashed border-gray-200 rounded-xl text-center text-sm text-gray-500">
                  로딩 중...
                </div>
              ) : symptoms.length === 0 ? (
                <div className="my-6 py-[18px] border border-dashed border-gray-200 rounded-xl text-center text-sm text-gray-500">
                  표시할 증상이 없습니다.
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-h-[260px] overflow-auto pr-0.5 scroll-smooth">
                  {symptoms.map((symptom) => (
                    <label
                      key={symptom.symptomId}
                      className="flex items-center gap-2 p-2 px-2.5 border border-gray-200 rounded-[10px] bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        className="w-[18px] h-[18px] rounded border-gray-300 cursor-pointer accent-blue-600"
                        style={{
                          appearance: "auto",
                          WebkitAppearance: "checkbox",
                        }}
                        checked={selectedSymptoms.includes(symptom.symptomId)}
                        onChange={() => toggleSymptom(symptom.symptomId)}
                        aria-label={symptom.name}
                      />
                      <span className="text-sm text-gray-900">
                        {symptom.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 카드 2: 전달 메모 */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-3.5 mb-3">
              <h3 className="mb-2.5 text-sm font-semibold text-gray-900">
                의료진에게 할 말
              </h3>
              <textarea
                id="noteToDoctor"
                className="w-full min-h-[110px] border border-gray-200 rounded-xl p-2.5 px-3 resize-y text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-[3px] focus:ring-blue-100 focus:border-blue-600"
                value={noteToDoctor}
                onChange={handleNoteChange}
                placeholder="의료진에게 할 말을 작성해주세요."
              />
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-gray-500">
                  최대 500자까지 입력 가능합니다.
                </div>
                <div
                  id="noteCounter"
                  className={`text-xs ${
                    noteToDoctor.length > maxLength
                      ? "text-red-600 font-bold"
                      : "text-gray-500"
                  }`}
                >
                  {noteToDoctor.length} / {maxLength}
                </div>
              </div>
            </div>
          </form>
        </main>

        {/* 하단 고정 버튼 */}
        <div className="fixed bottom-[76px] left-1/2 -translate-x-1/2 w-full max-w-[393px] px-4 py-4 bg-white border-t border-gray-100 z-40">
          <button
            id="nextBtn"
            type="button"
            onClick={handleNext}
            disabled={
              selectedSymptoms.length === 0 || noteToDoctor.length > maxLength
            }
            className="flex items-center justify-center w-full h-12 px-0 bg-[#2563EB] text-white text-base font-bold rounded-xl hover:brightness-[0.98] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            다음
          </button>
        </div>

        {/* 하단 네비게이션 */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] z-50">
          <BottomNav />
        </div>

        {/* 접수 확인 모달 */}
        <ReceptionConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          receptionData={receptionData}
          onConfirm={handleConfirmReception}
        />
      </div>
    </div>
  );
}
