/**
 * 약국 상세 모달 컴포넌트
 * 약국 선택 시 표시되는 상세 정보 모달
 */

function PharmacyDetailModal({ pharmacy, isOpen, onClose, onSend }) {
  if (!isOpen || !pharmacy) return null;

  // 별점 표시 함수
  const renderStars = (rating) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="pharmacy-rating-modal">
        <span className="stars-modal">
          {'⭐'.repeat(fullStars)}
          {hasHalfStar && '⭐'}
          {'☆'.repeat(emptyStars)}
        </span>
        <span className="rating-number-modal">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className={`pharmacy-detail-modal ${isOpen ? 'show' : ''}`}>
      <div className="modal-handle" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <div className="pharmacy-title-section">
            <h3 className="pharmacy-name">{pharmacy.name || pharmacy.pharmacyName}</h3>
            <span className={`status-badge ${pharmacy.open ? 'open' : 'closed'}`}>
              {pharmacy.open ? '영업중' : '영업종료'}
            </span>
          </div>
          {pharmacy.operatingHours && (
            <div className="pharmacy-hours">
              <span>🕐</span>
              <span>{pharmacy.operatingHours}</span>
            </div>
          )}
          <div className="pharmacy-location">
            <span>📍</span>
            <span>{pharmacy.address}</span>
          </div>
          {pharmacy.rating && renderStars(pharmacy.rating)}
        </div>
        
        <div className="modal-actions">
          <button className="btn-phone" onClick={() => window.location.href = `tel:${pharmacy.phoneNumber}`}>
            📞
          </button>
          <button className="btn-copy" onClick={() => navigator.clipboard.writeText(pharmacy.address)}>
            📋
          </button>
        </div>
        
        <div className="modal-main-action">
          <button className="btn-send-prescription" onClick={onSend}>
            처방전 전달하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default PharmacyDetailModal;

