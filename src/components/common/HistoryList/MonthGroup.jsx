/**
 * 월별 그룹 라벨
 */
export default function MonthGroup({ yearMonth }) {
  if (!yearMonth) return null;

  const [year, month] = yearMonth.split("-");
  const label = `${year}년 ${parseInt(month, 10)}월`;

  return (
    <div className="mx-4 mt-3 mb-2.5">
      <div className="px-4 py-3 bg-blue-50 text-blue-900 text-[13px] font-bold rounded-xl">
        {label}
      </div>
    </div>
  );
}
