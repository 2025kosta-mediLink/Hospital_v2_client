import { useState, useRef, useEffect } from "react";

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
      { value: "WAITING", label: "대기중" },
      { value: "COMPLETED", label: "진료완료" },
      { value: "CANCELLED", label: "취소" },
    ],
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (monthRef.current && !monthRef.current.contains(e.target)) {
        setIsMonthOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setIsStatusOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getMonthLabel = (value) => {
    if (!value || value === "ALL") return "전체";
    const option = monthOptions.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  const getStatusLabel = (value) => {
    if (!value || value === "ALL") return "전체";
    const option = statusOptions[type].find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  return (
    <div className="px-5 py-4 bg-white">
      <div className="flex gap-2.5">
        {/* 월 필터 */}
        <div ref={monthRef} className="relative">
          <button
            onClick={() => {
              setIsMonthOpen(!isMonthOpen);
              setIsStatusOpen(false);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#F6F8FB] border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span>{getMonthLabel(selectedMonth)}</span>
            <svg
              className={`w-3 h-3 transition-transform ${
                isMonthOpen ? "rotate-180" : ""
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {isMonthOpen && (
            <ul className="absolute top-full left-0 mt-1.5 min-w-[160px] bg-white border border-gray-200 rounded-xl shadow-lg p-1.5 z-10">
              <li
                onClick={() => {
                  onFilterChange({ month: "ALL", status: selectedStatus });
                  setIsMonthOpen(false);
                }}
                className={`px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-colors ${
                  !selectedMonth || selectedMonth === "ALL"
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "hover:bg-gray-50"
                }`}
              >
                전체
              </li>
              {monthOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => {
                    onFilterChange({
                      month: option.value,
                      status: selectedStatus,
                    });
                    setIsMonthOpen(false);
                  }}
                  className={`px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-colors ${
                    selectedMonth === option.value
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 상태 필터 */}
        <div ref={statusRef} className="relative">
          <button
            onClick={() => {
              setIsStatusOpen(!isStatusOpen);
              setIsMonthOpen(false);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#F6F8FB] border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span>{getStatusLabel(selectedStatus)}</span>
            <svg
              className={`w-3 h-3 transition-transform ${
                isStatusOpen ? "rotate-180" : ""
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {isStatusOpen && (
            <ul className="absolute top-full left-0 mt-1.5 min-w-[160px] bg-white border border-gray-200 rounded-xl shadow-lg p-1.5 z-10">
              {statusOptions[type].map((option) => (
                <li
                  key={option.value}
                  onClick={() => {
                    onFilterChange({
                      month: selectedMonth,
                      status: option.value,
                    });
                    setIsStatusOpen(false);
                  }}
                  className={`px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-colors ${
                    (!selectedStatus && option.value === "ALL") ||
                    selectedStatus === option.value
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
