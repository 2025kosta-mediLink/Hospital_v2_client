/**
 * ISO 날짜/시간 문자열을 파싱
 * @param {string} dateTimeStr - "2025-11-29T15:30:00"
 * @returns {Object} { date, time, yearMonth }
 */
export const parseDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return { date: "", time: "", yearMonth: "" };

  const [datePart, timePart] = dateTimeStr.split("T");
  const yearMonth = datePart.substring(0, 7); // "2025-11"
  const time = timePart.substring(0, 5); // "15:30"

  return {
    date: datePart,
    time: time,
    yearMonth: yearMonth,
  };
};

/**
 * 날짜를 한글 형식으로 포맷팅
 * @param {string} dateStr - "2025-11-29"
 * @returns {string} "2025년 11월 29일 (금)"
 */
export const formatDateLabel = (dateStr) => {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];

  return `${year}년 ${month}월 ${day}일 (${weekday})`;
};

/**
 * 시간을 오전/오후 형식으로 포맷팅
 * @param {string} timeStr - "15:30"
 * @returns {string} "오후 3:30"
 */
export const formatTimeLabel = (timeStr) => {
  if (!timeStr) return "";

  const [hour, minute] = timeStr.split(":").map(Number);
  const period = hour < 12 ? "오전" : "오후";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;

  return `${period} ${displayHour}:${minute.toString().padStart(2, "0")}`;
};

/**
 * 연월 배열을 월 옵션으로 변환
 * @param {string[]} yearMonths - ["2025-11", "2025-10"]
 * @returns {Array} [{ value: "2025-11", label: "2025년 11월" }]
 */
export const generateMonthOptions = (yearMonths) => {
  return yearMonths
    .sort()
    .reverse()
    .map((ym) => {
      const [y, m] = ym.split("-");
      return {
        value: ym,
        label: `${y}년 ${parseInt(m, 10)}월`,
      };
    });
};

/**
 * 데이터를 월별로 그룹핑하고 날짜순 정렬
 * @param {Array} items - 변환된 데이터 배열
 * @param {string} dateField - 날짜 필드명 ("appointmentDate" or "receptionDate")
 * @param {string} timeField - 시간 필드명 ("appointmentTime" or "receptionTime")
 * @returns {Object} 월별로 그룹핑된 객체
 */
export const groupByMonth = (items, dateField, timeField) => {
  const grouped = {};

  items.forEach((item) => {
    const ym = item.yearMonth || "기타";
    if (!grouped[ym]) grouped[ym] = [];
    grouped[ym].push(item);
  });

  // 각 그룹 내에서 날짜 내림차순 정렬
  Object.keys(grouped).forEach((key) => {
    grouped[key].sort((a, b) => {
      const dateA = new Date(`${a[dateField]}T${a[timeField]}`);
      const dateB = new Date(`${b[dateField]}T${b[timeField]}`);
      return dateB - dateA;
    });
  });

  return grouped;
};
