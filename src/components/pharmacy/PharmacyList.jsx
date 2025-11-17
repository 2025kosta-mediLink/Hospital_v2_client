/**
 * 약국 리스트 컴포넌트
 * 약국 리스트 오버레이 형태로 표시
 */

import PharmacyListOverlay from './PharmacyListOverlay';

function PharmacyList({ pharmacies, onSelect }) {
  if (!pharmacies || pharmacies.length === 0) {
    return null;
  }

  return (
    <PharmacyListOverlay
      pharmacies={pharmacies}
      onPharmacyClick={onSelect}
    />
  );
}

export default PharmacyList;

