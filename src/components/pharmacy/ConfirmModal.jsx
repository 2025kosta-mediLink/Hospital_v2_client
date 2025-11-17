/**
 * 확인 모달 컴포넌트
 * 처방전 전달 확인 모달
 */

function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className={`confirm-modal ${isOpen ? 'show' : ''}`}>
      <div className="confirm-overlay" onClick={onCancel}></div>
      <div className="confirm-content">
        <div className="confirm-header">
          <h3>처방전 전달 확인</h3>
        </div>
        <div className="confirm-body">
          <p>{message}</p>
        </div>
        <div className="confirm-actions">
          <button className="btn-cancel" onClick={onCancel}>취소</button>
          <button className="btn-confirm" onClick={onConfirm}>전달하기</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;

