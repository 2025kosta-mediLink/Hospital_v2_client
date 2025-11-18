/**
 * 예약/접수 정보 카드
 */
export default function InfoCard({ type, numberLabel, data }) {
  const isReservation = type === "reservation";

  // 날짜 포맷팅 (YYYY-MM-DD → YYYY년 M월 D일 (요일))
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return `${year}년 ${month}월 ${day}일 (${weekday})`;
  };

  // 현재 시간 포맷팅
  const getCurrentDateTime = () => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(now.getDate()).padStart(2, "0")}`;
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    return { date: formatDate(dateStr), time: timeStr };
  };

  const receptionDateTime = getCurrentDateTime();

  return (
    <div className="w-full p-4 bg-gray-100 rounded-xl flex flex-col gap-3">
      {/* 제목 */}
      <div className="flex items-center gap-1.5 font-semibold text-[17px] text-gray-900">
        <svg
          className="w-5 h-5 text-blue-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
            clipRule="evenodd"
          />
        </svg>
        <span>{isReservation ? "예약 정보" : "접수 정보"}</span>
      </div>

      {/* 정보 행들 */}
      <InfoRow label={numberLabel} value={data?.reservationNo} />
      <InfoRow label="진료과" value={data?.departmentName} />
      <InfoRow label="담당의사" value={data?.doctorName} />

      {/* 예약일시 (예약만) */}
      {isReservation && (
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-gray-600">예약일시</span>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[15px] font-semibold text-gray-900">
              {formatDate(data?.appointmentDate)}
            </span>
            <span className="text-[15px] font-semibold text-blue-600">
              {data?.appointmentTime}
            </span>
          </div>
        </div>
      )}

      {/* 접수일시 (접수만) */}
      {!isReservation && (
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-gray-600">접수일시</span>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[15px] font-semibold text-gray-900">
              {receptionDateTime.date}
            </span>
            <span className="text-[15px] font-semibold text-blue-600">
              {receptionDateTime.time}
            </span>
          </div>
        </div>
      )}

      {/* 증상 (접수만) */}
      {!isReservation && data?.symptom && (
        <div className="flex items-start justify-between gap-3">
          <span className="text-sm font-medium text-gray-600">증상</span>
          <span className="text-[15px] font-semibold text-gray-900 text-right flex-1">
            {data.symptom}
          </span>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="text-[15px] font-semibold text-gray-900">{value}</span>
    </div>
  );
}
