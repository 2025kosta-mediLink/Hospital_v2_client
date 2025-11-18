import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import BottomNav from "../../components/layout/BottomNav";
import ReceptionConfirmModal from "../../components/reception/ReceptionConfirmModal"; // ✅ 추가
import { getSymptoms } from "../../api/symptomApi";
import { createReception, getReceptionDetail } from "../../api/receptionApi";

export default function SymptomSelectPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { doctorId, doctorName, departmentName } = location.state || {};

  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [noteToDoctor, setNoteToDoctor] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // ✅ 추가

  const maxLength = 500;

  // 증상 목록 로드
  useEffect(() => {
    loadSymptoms();
  }, []);

  const loadSymptoms = async () => {
    setIsLoading(true);
    try {
      const result = await getSymptoms();
      if (result.isSuccess) {
        setSymptoms(result.data || []);
      }
    } catch (error) {
      console.error("증상 목록 로드 실패:", error);

      // 401 에러면 로그인 페이지로
      if (error.response?.status === 401) {
        alert("로그인이 필요합니다.");
        navigate("/login", {
          state: {
            from: location.pathname,
            message: "증상 입력을 위해 로그인이 필요합니다.",
          },
        });
        return;
      }

      alert("증상 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 증상 선택/해제
  const toggleSymptom = (symptomId) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId)
        ? prev.filter((id) => id !== symptomId) // ✅ 오타 수정 (sympathomId → symptomId)
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

  // ✅ "다음" 버튼 클릭 → 모달 열기 (기존 handleSubmit을 handleNext로 변경)
  const handleNext = (e) => {
    e.preventDefault();

    if (noteToDoctor.length > maxLength) {
      alert(`전달사항은 최대 ${maxLength}자까지 입력 가능합니다.`);
      return;
    }

    // 모달 열기
    setIsModalOpen(true);
  };

  // ✅ 모달에서 "바로 접수하기" 클릭 → 실제 API 호출
  const handleConfirmReception = async () => {
    try {
      const createResult = await createReception({
        doctorId,
        symptomIds: selectedSymptoms.length > 0 ? selectedSymptoms : undefined,
        noteToDoctor: noteToDoctor.trim() || undefined,
        consentNotice: true,
      });

      if (createResult.isSuccess) {
        const receptionId =
          createResult.data?.receptionId ||
          createResult.data?.id ||
          createResult.data;

        // 접수 상세 조회
        const detailResult = await getReceptionDetail(receptionId);

        if (detailResult.isSuccess) {
          // 모달 닫기
          setIsModalOpen(false);

          // 완료 페이지로 이동
          navigate("/reception/complete", {
            state: {
              data: {
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
      alert(error.message || "접수에 실패했습니다.");
      throw error;
    }
  };

  // ✅ 모달에 전달할 데이터 준비
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
            type="button" // ✅ submit → button으로 변경
            onClick={handleNext} // ✅ handleSubmit → handleNext로 변경
            disabled={noteToDoctor.length > maxLength} // ✅ isSubmitting 제거
            className="flex items-center justify-center w-full h-12 px-0 bg-[#2563EB] text-white text-base font-bold rounded-xl hover:brightness-[0.98] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            다음
          </button>
        </div>

        {/* 하단 네비게이션 */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] z-50">
          <BottomNav />
        </div>

        {/* ✅ 접수 확인 모달 추가 */}
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
