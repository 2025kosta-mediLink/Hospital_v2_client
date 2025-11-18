import React, { useState } from "react";

/**
 * 달력 컴포넌트
 *
 * @param {string} selectedDate - 선택된 날짜 (YYYY-MM-DD)
 * @param {function} onDateSelect - 날짜 선택 핸들러
 * @param {function} isDateSelectable - 날짜 선택 가능 여부 체크 함수
 * @param {Date} initialMonth - 초기 표시 월 (기본: 현재 월)
 */
function Calendar({
  selectedDate,
  onDateSelect,
  isDateSelectable = () => true,
  initialMonth = new Date(),
}) {
  const [currentMonth, setCurrentMonth] = useState(initialMonth);

  // 날짜 포맷 함수
  const formatDateToString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 이전/다음 달 이동
  const handlePrevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  // 캘린더 렌더링 데이터 생성
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days = [];

    // 빈 칸
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ isEmpty: true, key: `empty-${i}` });
    }

    // 날짜
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      const isToday = dateStr === formatDateToString(new Date());
      const isSelected = dateStr === selectedDate;
      const isSelectable = isDateSelectable(dateStr);

      days.push({
        day,
        dateStr,
        isToday,
        isSelected,
        isSelectable,
        key: dateStr,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="bg-white p-3 px-4">
      {/* 달력 헤더 */}
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={handlePrevMonth}
          className="flex h-12 w-12 items-center justify-center rounded-lg hover:bg-gray-100"
          aria-label="이전달"
        >
          <svg
            className="h-7 w-7 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="text-lg font-bold">
          {currentMonth.getFullYear()}.
          {String(currentMonth.getMonth() + 1).padStart(2, "0")}
        </div>

        <button
          onClick={handleNextMonth}
          className="flex h-12 w-12 items-center justify-center rounded-lg hover:bg-gray-100"
          aria-label="다음달"
        >
          <svg
            className="h-7 w-7 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* 달력 그리드 */}
      <div className="mt-3 grid grid-cols-7 gap-2">
        {/* 요일 헤더 */}
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <div key={day} className="py-1 text-center text-xs text-gray-400">
            {day}
          </div>
        ))}

        {/* 날짜 */}
        {calendarDays.map((item) =>
          item.isEmpty ? (
            <button
              key={item.key}
              disabled
              className="h-10 rounded-lg"
            ></button>
          ) : (
            <button
              key={item.key}
              onClick={() => onDateSelect(item.dateStr)}
              disabled={!item.isSelectable}
              className={`
                flex h-10 items-center justify-center rounded-lg font-semibold
                ${
                  !item.isSelectable
                    ? "cursor-not-allowed bg-white text-gray-300"
                    : item.isSelected
                    ? "bg-blue-500 text-white"
                    : item.isToday
                    ? "border-2 border-blue-500 bg-white text-blue-500"
                    : "bg-white text-gray-900 hover:bg-gray-50"
                }
              `}
            >
              {item.day}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default Calendar;
