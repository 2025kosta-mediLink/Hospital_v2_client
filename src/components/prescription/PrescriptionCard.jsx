/**
 * 처방전 카드 컴포넌트
 * 처방전 정보를 카드 형태로 표시하는 재사용 가능한 컴포넌트
 */

function PrescriptionCard({ item, onSelect, isSelected, onView, onStatusCheck }) {
  const isCompleted = item.completed || false;
  const hasReceivedAt = item.receivedAt != null;
  // 완료되었거나 수령한 경우 선택 불가
  const canSelect = !isCompleted && !hasReceivedAt;
  
  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (e) {
      return dateString;
    }
  };

  const handleCardClick = (e) => {
    // 버튼이나 체크박스를 클릭한 경우는 처리하지 않음
    if (e.target.closest('button') || e.target.closest('.prescription-checkbox')) {
      return;
    }
    
    // 완료되지 않은 경우에만 선택 가능
    if (canSelect && onSelect) {
      onSelect(item.prescriptionId, !isSelected);
    }
  };

  const handleCheckboxChange = (e) => {
    e.stopPropagation(); // 카드 클릭 이벤트와 중복 방지
    if (onSelect) {
      onSelect(item.prescriptionId, e.target.checked);
    }
  };

  const handleButtonClick = (e) => {
    e.stopPropagation(); // 카드 클릭 이벤트와 중복 방지
  };

  return (
    <div 
      className={`prescription-card ${isSelected ? 'selected' : ''}`}
      onClick={handleCardClick}
      style={{ cursor: canSelect ? 'pointer' : 'default' }}
    >
      {/* Checkbox */}
      <label className="prescription-checkbox" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          className="checkbox-input"
          checked={isSelected}
          disabled={!canSelect}
          onChange={handleCheckboxChange}
        />
        <div className={`checkbox-custom ${isCompleted || hasReceivedAt ? 'completed' : ''}`}></div>
      </label>

      {/* 수령 정보 (체크박스 아래) */}
      {(isCompleted || hasReceivedAt) && (item.pharmacyName || item.receivedAt || item.completedDate) && (
        <div className="receipt-info">
          <div className="receipt-pharmacy">{item.pharmacyName || ''}</div>
          <div className="receipt-date">{formatDate(item.receivedAt || item.completedDate || item.completedAt)}</div>
        </div>
      )}

      {/* Department Row */}
      <div className="department-row">
        <span className="label">진료과</span>
        <span className="value">{item.departmentName}</span>
      </div>

      {/* Doctor Row */}
      <div className="doctor-row">
        <span className="label">의사명</span>
        <span className="value">{item.doctorName}</span>
      </div>

      {/* Date Row */}
      <div className="date-row">
        <span className="label">진료일</span>
        <span className="value">{item.treatmentDate || '-'}</span>
      </div>

      {/* Actions Row */}
      <div className="actions-row">
        <div className="prescription-actions">
          <button className="btn-view" onClick={(e) => {
            handleButtonClick(e);
            onView && onView(item.prescriptionId);
          }}>
            처방전 보기
          </button>
          <button className="btn-status" onClick={(e) => {
            handleButtonClick(e);
            onStatusCheck && onStatusCheck(item.prescriptionId);
          }}>
            조제 상황 확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrescriptionCard;

