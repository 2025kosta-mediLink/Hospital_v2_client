import MonthGroup from "./MonthGroup";
import HistoryCard from "./HistoryCard";
import EmptyState from "./EmptyState";

/**
 * 예약/접수 내역 리스트 (월별 그룹)
 * @param {Object} props
 * @param {'reservation'|'reception'} props.type - 예약 또는 접수
 * @param {Object} props.groupedData - 월별로 그룹화된 데이터 { "2025-11": [...], "2025-10": [...] }
 * @param {Function} props.onCancel - 취소 버튼 클릭 핸들러
 * @param {Function} props.onShare - 공유 버튼 클릭 핸들러
 */
export default function HistoryList({
  type = "reservation",
  groupedData = {},
  onCancel,
  onShare,
}) {
  const entries = Object.entries(groupedData);

  // 데이터가 없으면 빈 상태 표시
  if (entries.length === 0) {
    return <EmptyState type={type} />;
  }

  return (
    <div className="flex flex-col gap-3 pb-6">
      {entries.map(([yearMonth, items]) => (
        <div key={yearMonth}>
          {/* 월별 그룹 라벨 */}
          <MonthGroup yearMonth={yearMonth} />

          {/* 해당 월의 카드들 */}
          <div className="flex flex-col gap-3 px-4">
            {items.map((item) => (
              <HistoryCard
                key={item.reservationId || item.receptionId}
                type={type}
                item={item}
                onCancel={onCancel}
                onShare={onShare}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
