/**
 * 취소 확인 모달
 * @param {boolean} isOpen - 모달 열림 상태
 * @param {function} onClose - 모달 닫기 함수
 * @param {function} onConfirm - 확인 버튼 클릭 함수
 * @param {string} type - "reservation" | "reception"
 * @param {object} data - 취소할 항목 데이터
 */
export default function CancelConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  type,
  data,
}) {
  if (!isOpen || !data) return null;

  const isReservation = type === "reservation";
  const title = isReservation ? "예약 취소" : "접수 취소";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-600/20 px-4"
      style={{ margin: 0, left: 0, right: 0 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[340px] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 내용 */}
        <div className="p-4 space-y-3">
          {/* 안내 메시지 */}
          <div className="bg-red-50 rounded-xl p-3">
            <p className="text-sm text-red-800 text-center">
              {isReservation
                ? "예약을 취소하시겠습니까?"
                : "접수를 취소하시겠습니까?"}
            </p>
          </div>

          {/* 취소 정보 */}
          <div className="bg-gray-50 rounded-xl p-3 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏥</span>
              <div>
                <div className="text-[10px] text-gray-500 mb-0.5">진료과</div>
                <div className="text-sm font-semibold text-gray-900">
                  {data.departmentName}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xl">👨‍⚕️</span>
              <div>
                <div className="text-[10px] text-gray-500 mb-0.5">
                  의료진
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {data.doctorName} 교수
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xl">📅</span>
              <div>
                <div className="text-[10px] text-gray-500 mb-0.5">
                  {isReservation ? "예약 일시" : "접수 일시"}
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {data.dateLabel}
                </div>
                <div className="text-sm font-semibold text-blue-600">
                  {data.timeLabel}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="bg-white border-t border-gray-200 p-3 flex-shrink-0">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onClose}
              className="py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              className="py-2.5 bg-red-400 text-white text-sm font-semibold rounded-xl hover:bg-red-500 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
