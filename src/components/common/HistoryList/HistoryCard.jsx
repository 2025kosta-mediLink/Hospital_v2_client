/**
 * 예약/접수 카드
 */
export default function HistoryCard({
  type = "reservation",
  item,
  onCancel,
  onShare,
  onDetail,
}) {
  const isReservation = type === "reservation";

  const statusConfig = {
    // 예약 상태
    RESERVED: { bg: "bg-[#E6F6E6]", text: "text-[#127C2E]", label: "예약완료" },
    DONE: {
      bg: "bg-[#E7F0FF]",
      text: "text-[#1743B3]",
      label: isReservation ? "접수완료" : "진료완료",
    },
    CANCELLED: { bg: "bg-[#FDECEC]", text: "text-[#B42318]", label: "취소" },

    // 접수 상태
    WAITING: { bg: "bg-yellow-50", text: "text-yellow-700", label: "대기" },
    IN_SERVICE: { bg: "bg-blue-50", text: "text-blue-600", label: "진료중" },
  };

  const status = statusConfig[item.status] || statusConfig.RESERVED;

  // 취소 가능 여부 체크
  const isCancellable = () => {
    if (isReservation) {
      return item.status === "RESERVED";
    } else {
      return item.status === "WAITING";
    }
  };

  // 버튼 표시 여부 (취소됨/완료됨 제외)
  const showButtons = item.status !== "CANCELLED" && item.status !== "DONE";

  // 카드 클릭 핸들러 (접수 카드에만 상세보기)
  const handleCardClick = (e) => {
    // 버튼을 클릭한 경우는 처리하지 않음
    if (e.target.closest('button')) {
      return;
    }
    
    // 접수 카드이고 상세보기 핸들러가 있으면 실행
    if (!isReservation && onDetail) {
      onDetail(item);
    }
  };

  return (
    <article 
      className={`bg-white border border-gray-200 rounded-2xl p-3.5 shadow-sm ${!isReservation && onDetail ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}`}
      onClick={handleCardClick}
    >
      {/* 상단: 제목 + 상태 */}
      <div className="flex items-center justify-between gap-2.5 mb-1">
        <div className="flex items-center gap-1.5 text-[15px] font-extrabold text-gray-900">
          <span>{item.departmentName}</span>
          <span className="text-gray-400">·</span>
          <span>{item.doctorName} 교수</span>
          {/* 접수 카드에만 상세 버튼을 작게 표시 */}
          {!isReservation && onDetail && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDetail(item);
              }}
              className="ml-1 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 bg-gray-100 rounded hover:bg-gray-200 transition-colors flex items-center gap-0.5"
              title="상세보기"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>상세</span>
            </button>
          )}
        </div>

        <span
          className={`px-2.5 py-1.5 rounded-full text-xs font-bold ${status.bg} ${status.text}`}
        >
          {status.label}
        </span>
      </div>

      {/* 예약번호/접수번호 */}
      <div className="text-xs text-gray-400 mb-2.5">
        {isReservation ? item.reservationNo : item.receptionNo}
      </div>

      {/* 메타 정보 */}
      <div className="flex flex-col gap-1.5 mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <div className="w-5 h-5 rounded flex items-center justify-center">
            <svg
              className="w-3.5 h-3.5 text-purple-600"
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
          <span>{item.dateLabel}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <div className="w-5 h-5 rounded flex items-center justify-center">
            <svg
              className="w-3.5 h-3.5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <span>{item.timeLabel}</span>
        </div>
      </div>

      {/* 액션 버튼 */}
      {showButtons && (
        <div className="flex gap-2">
          {isCancellable() && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancel(item);
              }}
              className="flex-1 px-4 py-2.5 bg-red-50 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-100 transition-colors"
            >
              취소
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare(item);
            }}
            className="flex-1 px-4 py-2.5 bg-[#E7F0FF] text-[#1743B3] text-sm font-semibold rounded-lg hover:bg-[#DCE6FF] transition-colors"
          >
            카카오톡 공유
          </button>
        </div>
      )}
    </article>
  );
}
