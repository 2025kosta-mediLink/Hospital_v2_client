/**
 * 약국 리스트 아이템 컴포넌트
 * 약국 리스트 오버레이에서 사용하는 아이템
 */

function PharmacyListItem({ pharmacy, onClick }) {
  return (
    <div className="pharmacy-list-item" onClick={onClick}>
      <div className="pharmacy-info">
        <div className="pharmacy-name">{pharmacy.name || pharmacy.pharmacyName}</div>
        <div className="pharmacy-distance">
          {pharmacy.distanceMeters ? `${pharmacy.distanceMeters.toFixed(0)}m` : ''}
        </div>
        <div className="pharmacy-address">
          <span>📍</span>
          <span>{pharmacy.address}</span>
        </div>
      </div>
      <div className="pharmacy-status">
        <span className={`status-badge ${pharmacy.open ? 'open' : 'closed'}`}>
          {pharmacy.open ? '영업중' : '영업종료'}
        </span>
      </div>
    </div>
  );
}

export default PharmacyListItem;

