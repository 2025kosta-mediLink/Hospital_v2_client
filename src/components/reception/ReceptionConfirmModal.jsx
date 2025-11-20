import { useState } from "react";
import Modal from "../common/Modal";

export default function ReceptionConfirmModal({
  isOpen,
  onClose,
  receptionData,
  onConfirm,
}) {
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!isChecked) {
      alert("주의사항을 확인하고 동의해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("접수 확인 에러:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="p-0 max-w-[340px]">
      {/* 제목 */}
      <div className="px-4 pt-4 pb-3">
        <h2 className="text-lg font-extrabold text-gray-900">접수 정보 확인</h2>
      </div>

      {/* 정보 섹션 */}
      <div className="px-4 pb-3">
        <div className="space-y-0 divide-y divide-gray-100">
          {/* 진료과 */}
          <div className="flex justify-between items-center py-2.5">
            <span className="text-sm text-gray-500">진료과</span>
            <span className="text-sm font-semibold text-gray-900">
              {receptionData.departmentName}
            </span>
          </div>

          {/* 의료진 */}
          <div className="flex justify-between items-center py-2.5">
            <span className="text-sm text-gray-500">의료진</span>
            <span className="text-sm font-semibold text-gray-900">
              {receptionData.doctorName} 교수
            </span>
          </div>

          {/* 접수 일시 */}
          <div className="flex justify-between items-center py-2.5">
            <span className="text-sm text-gray-500 flex-shrink-0">
              접수 일시
            </span>
            <span className="text-sm font-semibold text-gray-900 text-right">
              {new Date()
                .toLocaleString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  weekday: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                .replace(/\. /g, ".")
                .replace(" ", " ")}
            </span>
          </div>

          {/* 증상 - 오른쪽 정렬로 변경 */}
          {receptionData.symptoms && receptionData.symptoms.length > 0 && (
            <div className="flex justify-between items-start py-2.5">
              <span className="text-sm text-gray-500">증상</span>
              <div className="flex flex-wrap gap-1.5 justify-end max-w-[200px]">
                {receptionData.symptoms.map((symptom, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 전달사항 */}
          {receptionData.noteToDoctor && (
            <div className="pt-2.5">
              <span className="text-sm text-gray-500 block mb-1.5">
                전달사항
              </span>
              <p className="text-sm text-gray-800 bg-gray-50 rounded-lg p-2.5 border border-gray-100 leading-relaxed">
                {receptionData.noteToDoctor}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 안내사항 */}
      <div className="px-4 pb-3">
        <div className="rounded-xl bg-blue-50 p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="text-sm">ℹ️</span>
            <span className="text-sm font-semibold text-blue-600">
              안내사항
            </span>
          </div>
          <ul className="space-y-1 text-xs text-gray-700 leading-relaxed">
            <li className="flex items-start gap-1.5">
              <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
              <span>
                호명 후 <strong className="text-blue-700">10분</strong> 전
                내원해주세요
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
              <span>
                <strong className="text-blue-700">신분증</strong>을 반드시
                지참해 주세요
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
              <span>
                대기 시간은 상황에 따라{" "}
                <strong className="text-blue-700">변동</strong>될 수 있습니다
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* 동의 체크박스 */}
      <div className="px-4 pb-3">
        <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer accent-blue-600 flex-shrink-0"
            style={{
              appearance: "auto",
              WebkitAppearance: "checkbox",
            }}
          />
          <span className="text-xs text-gray-700 leading-snug">
            안내사항을 확인했으며 동의합니다
          </span>
        </label>
      </div>

      {/* 버튼 */}
      <div className="px-4 pb-4">
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="h-11 flex-1 rounded-xl bg-gray-100 font-bold text-sm text-gray-600 transition-colors hover:bg-gray-200"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isChecked || isSubmitting}
            className="h-11 flex-1 rounded-xl bg-blue-500 font-bold text-sm text-white transition-colors hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "접수 중..." : "접수 확정"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
