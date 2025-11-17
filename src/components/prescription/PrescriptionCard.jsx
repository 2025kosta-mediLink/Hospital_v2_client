/**
 * 처방전 카드 컴포넌트
 * 처방전 정보를 카드 형태로 표시하는 재사용 가능한 컴포넌트
 */

function PrescriptionCard({ item, onSelect, isSelected, onView, onStatusCheck }) {
  const isCompleted = item.completed || false;
  const canSelect = item.canSelect && !isCompleted;

  return (
    <div className="prescription-card">
      {/* Checkbox */}
      <label className="prescription-checkbox">
        <input
          type="checkbox"
          className="checkbox-input"
          checked={isSelected}
          disabled={!canSelect}
          onChange={(e) => onSelect && onSelect(item.prescriptionId, e.target.checked)}
        />
        <div className={`checkbox-custom ${isCompleted ? 'completed' : ''}`}></div>
      </label>

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
          <button className="btn-view" onClick={() => onView && onView(item.prescriptionId)}>
            처방전 보기
          </button>
          <button className="btn-status" onClick={() => onStatusCheck && onStatusCheck(item.prescriptionId)}>
            조제 상황 확인
          </button>
        </div>

        {/* Completed Status Text (오른쪽에 정렬) */}
        {isCompleted && (
          <div className="completed-status-right">
            <div className="completed-date-right">{item.completedAt || item.completedDate || ''}</div>
            <div className="completed-pharmacy-right">{item.pharmacyName || ''}</div>
            <div className="completed-status-text">조제 완료</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PrescriptionCard;

