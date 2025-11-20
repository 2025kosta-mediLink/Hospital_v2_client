import { useState, useEffect, useRef } from "react";

/**
 * 월/상태 필터 컴포넌트
 */
export default function FilterTabs({
  type = "reservation",
  selectedMonth,
  selectedStatus,
  monthOptions = [],
  onFilterChange,
}) {
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const monthRef = useRef(null);
  const statusRef = useRef(null);

  const statusOptions = {
    reservation: [
      { value: "ALL", label: "전체" },
      { value: "RESERVED", label: "예약완료" },
      { value: "DONE", label: "접수완료" },
      { value: "CANCELLED", label: "취소" },
    ],
    reception: [
      { value: "ALL", label: "전체" },
      { value: "WAITING", label: "대기" },
      { value: "IN_SERVICE", label: "진료중" },
      { value: "DONE", label: "진료완료" },
      { value: "CANCELLED", label: "취소" },
    ],
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (monthRef.current && !monthRef.current.contains(event.target)) {
        setIsMonthOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setIsStatusOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getMonthLabel = (value) => {
    if (value === "ALL") return "전체";
    const option = monthOptions.find((opt) => opt.value === value);
    return option ? option.label : "전체";
  };

  const getStatusLabel = (value) => {
    const option = statusOptions[type].find((opt) => opt.value === value);
    return option ? option.label : "전체";
  };

  return (
    <div className="flex gap-2 px-4 py-3 bg-white border-b border-gray-200">
      {/* 월 필터 */}
      <div ref={monthRef} className="relative">
        <button
          onClick={() => setIsMonthOpen(!isMonthOpen)}
          className="flex items-center gap-1 px-3 py-2 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span>{getMonthLabel(selectedMonth)}</span>
          <svg
            className={`w-4 h-4 transition-transform ${
              isMonthOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isMonthOpen && (
          <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
            <button
              onClick={() => {
                onFilterChange({ month: "ALL", status: selectedStatus });
                setIsMonthOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                selectedMonth === "ALL"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700"
              }`}
            >
              전체
            </button>
            {monthOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onFilterChange({
                    month: option.value,
                    status: selectedStatus,
                  });
                  setIsMonthOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                  selectedMonth === option.value
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 상태 필터 */}
      <div ref={statusRef} className="relative">
        <button
          onClick={() => setIsStatusOpen(!isStatusOpen)}
          className="flex items-center gap-1 px-3 py-2 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span>{getStatusLabel(selectedStatus)}</span>
          <svg
            className={`w-4 h-4 transition-transform ${
              isStatusOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isStatusOpen && (
          <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {statusOptions[type].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onFilterChange({
                    month: selectedMonth,
                    status: option.value,
                  });
                  setIsStatusOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                  selectedStatus === option.value
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
