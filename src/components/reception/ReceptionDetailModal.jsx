/**
 * 접수 상세 정보 모달
 */
export default function ReceptionDetailModal({ isOpen, onClose, detail }) {
  if (!isOpen || !detail) return null;

  const statusConfig = {
    WAITING: { bg: "bg-yellow-50", text: "text-yellow-700", label: "대기" },
    IN_SERVICE: { bg: "bg-blue-50", text: "text-blue-600", label: "진료중" },
    DONE: { bg: "bg-[#E7F0FF]", text: "text-[#1743B3]", label: "진료완료" },
    CANCELLED: { bg: "bg-[#FDECEC]", text: "text-[#B42318]", label: "취소" },
  };

  const status = statusConfig[detail.status] || statusConfig.WAITING;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-600/20 px-4"
      style={{ margin: 0, left: 0, right: 0 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[340px] max-h-[70vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <h2 className="text-base font-bold text-gray-900">접수 상세</h2>
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

        {/* 내용 - 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* 접수번호 & 상태 */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{detail.receptionNo}</span>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold ${status.bg} ${status.text}`}
            >
              {status.label}
            </span>
          </div>

          {/* 진료 정보 */}
          <div className="bg-gray-50 rounded-xl p-3 space-y-2.5">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-gray-500 mb-0.5">진료과</div>
                <div className="text-sm font-semibold text-gray-900">
                  {detail.departmentName}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-gray-500 mb-0.5">의료진</div>
                <div className="text-sm font-semibold text-gray-900">
                  {detail.doctorName} 교수
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-gray-500 mb-0.5">
                  접수 일시
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {new Date(detail.createdAt).toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 증상 */}
          {detail.symptomNames && detail.symptomNames.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <div className="text-xs font-semibold text-gray-700">증상</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-3">
                <div className="flex flex-wrap gap-1.5">
                  {detail.symptomNames.map((symptom, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 bg-white text-blue-700 text-xs font-medium rounded-full border border-blue-200"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 전달사항 */}
          {detail.noteToDoctor && detail.noteToDoctor.trim() !== "" && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <div className="text-xs font-semibold text-gray-700">
                  전달사항
                </div>
              </div>
              <div className="bg-yellow-50 rounded-xl p-3">
                <p className="text-xs text-gray-800 whitespace-pre-wrap">
                  {detail.noteToDoctor}
                </p>
              </div>
            </div>
          )}

          {/* 대기 정보 (WAITING 상태일 때) */}
          {detail.status === "WAITING" && detail.queueNo && (
            <div className="bg-green-50 rounded-xl p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-green-800">
                  대기번호
                </span>
                <span className="text-xl font-bold text-green-700">
                  {detail.queueNo}번
                </span>
              </div>
              {detail.estimatedWaitMinutes && (
                <div className="text-[10px] text-green-700">
                  예상 대기시간: 약 {detail.estimatedWaitMinutes}분
                </div>
              )}
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="bg-white border-t border-gray-200 p-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
