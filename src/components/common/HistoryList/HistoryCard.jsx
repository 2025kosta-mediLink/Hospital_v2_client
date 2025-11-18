/**
 * 예약/접수 카드
 */
export default function HistoryCard({
  type = "reservation",
  item,
  onCancel,
  onShare,
}) {
  const isReservation = type === "reservation";

  const statusConfig = {
    RESERVED: { bg: "bg-[#E6F6E6]", text: "text-[#127C2E]", label: "예약완료" },
    DONE: { bg: "bg-[#E7F0FF]", text: "text-[#1743B3]", label: "접수완료" },
    CANCELLED: { bg: "bg-[#FDECEC]", text: "text-[#B42318]", label: "취소" },
    WAITING: { bg: "bg-yellow-50", text: "text-yellow-700", label: "대기중" },
    COMPLETED: { bg: "bg-green-50", text: "text-green-700", label: "진료완료" },
  };

  const status = statusConfig[item.status] || statusConfig.RESERVED;

  return (
    <article className="bg-white border border-gray-200 rounded-2xl p-3.5 shadow-sm">
      {/* 상단: 제목 + 상태 */}
      <div className="flex items-center justify-between gap-2.5 mb-1">
        <div className="flex items-center gap-1.5 text-[15px] font-extrabold text-gray-900">
          <span>{item.departmentName}</span>
          <span className="text-gray-400">·</span>
          <span>{item.doctorName} 교수</span>
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
          <span>📅</span>
          <span>{item.dateLabel}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span>⏰</span>
          <span>{item.timeLabel}</span>
        </div>
      </div>

      {/* 액션 버튼 */}
      {item.status !== "CANCELLED" && (
        <div className="flex gap-2">
          <button
            onClick={() => onShare(item)}
            className="flex-1 px-4 py-2.5 bg-[#E7F0FF] text-[#1743B3] text-sm font-semibold rounded-lg hover:bg-[#DCE6FF] transition-colors"
          >
            카카오톡 공유
          </button>

          {item.status === "RESERVED" && (
            <button
              onClick={() => onCancel(item)}
              className="flex-1 px-4 py-2.5 bg-[#ECEFF3] text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              취소하기
            </button>
          )}
        </div>
      )}
    </article>
  );
}
