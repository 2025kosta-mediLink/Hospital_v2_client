/**
 * 약국 리스트 오버레이 컴포넌트
 * 하단에 슬라이드업 형태로 표시되는 약국 리스트
 */

import PharmacyListItem from './PharmacyListItem';

function PharmacyListOverlay({ pharmacies, onPharmacyClick }) {
  if (!pharmacies || pharmacies.length === 0) {
    return null;
  }

  return (
    <div className="pharmacy-list-overlay">
      <div className="list-header">
        <div className="location-selector">현재 지도 중심 ∨</div>
        <div className="sort-selector">관련도순 ∨</div>
      </div>
      <div className="pharmacy-list">
        {pharmacies.map((pharmacy) => (
          <PharmacyListItem
            key={pharmacy.pharmacyId}
            pharmacy={pharmacy}
            onClick={() => onPharmacyClick && onPharmacyClick(pharmacy)}
          />
        ))}
      </div>
    </div>
  );
}

export default PharmacyListOverlay;

