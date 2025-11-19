/**
 * 약국 리스트 아이템 컴포넌트
 * 약국 리스트 오버레이에서 사용하는 아이템
 */

function PharmacyListItem({ pharmacy, onClick }) {
  // 별점 표시 함수
  const renderStars = (rating) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="pharmacy-rating">
        <span className="stars">
          {'⭐'.repeat(fullStars)}
          {hasHalfStar && '⭐'}
          {'☆'.repeat(emptyStars)}
        </span>
        <span className="rating-number">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="pharmacy-list-item" onClick={onClick}>
      <div className="pharmacy-info">
        <div className="pharmacy-name">{pharmacy.name || pharmacy.pharmacyName}</div>
        <div className="pharmacy-distance-row">
          <div className="pharmacy-distance">
            {pharmacy.distanceMeters ? `${pharmacy.distanceMeters.toFixed(0)}m` : ''}
          </div>
          {pharmacy.rating && renderStars(pharmacy.rating)}
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

