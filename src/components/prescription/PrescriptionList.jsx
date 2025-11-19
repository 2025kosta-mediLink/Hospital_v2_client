/**
 * 처방전 리스트 컴포넌트
 * 처방전 카드들을 표시
 */

import PrescriptionCard from './PrescriptionCard';

function PrescriptionList({ items, selectedIds, onSelect, onView, onStatusCheck }) {
  // items가 배열이 아니거나 비어있으면 null 반환
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  return (
    <div className="prescription-cards">
      {items.map((item) => {
        // prescriptionId가 null이면 receptionId를 사용
        const id = item.prescriptionId ?? item.receptionId;
        return (
          <PrescriptionCard
            key={id}
            item={item}
            isSelected={selectedIds?.includes(id) || false}
            onSelect={onSelect}
            onView={onView}
            onStatusCheck={onStatusCheck}
          />
        );
      })}
    </div>
  );
}

export default PrescriptionList;

