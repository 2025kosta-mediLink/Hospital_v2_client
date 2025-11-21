import React from "react";

/**
 * 시간 선택 그리드 컴포넌트
 *
 * @param {Array} amSlots - 오전 시간 슬롯 배열 ["09:00", "09:30", ...]
 * @param {Array} pmSlots - 오후 시간 슬롯 배열 ["13:00", "13:30", ...]
 * @param {Array} bookedTimes - 예약된 시간 배열 ["09:00", "14:30", ...]
 * @param {string} selectedTime - 선택된 시간 (HH:MM)
 * @param {function} onTimeSelect - 시간 선택 핸들러
 * @param {boolean} isLoading - 로딩 상태
 */
function TimeSlotGrid({
  amSlots = [],
  pmSlots = [],
  bookedTimes = [],
  selectedTime,
  onTimeSelect,
  isLoading = false,
}) {
  // 예약 가능 여부 체크
  const isTimeAvailable = (time) => {
    return !bookedTimes.includes(time);
  };

  if (isLoading) {
    return (
      <div className="bg-white p-4">
        <div className="py-8 text-center text-gray-500">
          시간을 불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4">
      {/* 오전 */}
      <div className="mb-6">
        <h3 className="mb-3 text-base font-bold">오전</h3>
        <div className="grid grid-cols-3 gap-2">
          {amSlots.length === 0 ? (
            <div className="col-span-3 px-1 py-3 text-sm text-gray-400">
              가능한 시간이 없습니다
            </div>
          ) : (
            amSlots.map((time) => {
              const isAvailable = isTimeAvailable(time);
              const isSelected = selectedTime === time;

              return (
                <button
                  key={time}
                  onClick={() => isAvailable && onTimeSelect(time)}
                  disabled={!isAvailable}
                  className={`
                    rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors
                    ${
                      !isAvailable
                        ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 line-through"
                        : isSelected
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-gray-200 bg-white text-gray-900 hover:border-blue-300 hover:bg-gray-50"
                    }
                  `}
                >
                  {time}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 오후 */}
      <div>
        <h3 className="mb-3 text-base font-bold">오후</h3>
        <div className="grid grid-cols-3 gap-2">
          {pmSlots.length === 0 ? (
            <div className="col-span-3 px-1 py-3 text-sm text-gray-400">
              가능한 시간이 없습니다
            </div>
          ) : (
            pmSlots.map((time) => {
              const isAvailable = isTimeAvailable(time);
              const isSelected = selectedTime === time;

              return (
                <button
                  key={time}
                  onClick={() => isAvailable && onTimeSelect(time)}
                  disabled={!isAvailable}
                  className={`
                    rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors
                    ${
                      !isAvailable
                        ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 line-through"
                        : isSelected
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-gray-200 bg-white text-gray-900 hover:border-blue-300 hover:bg-gray-50"
                    }
                  `}
                >
                  {time}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default TimeSlotGrid;
