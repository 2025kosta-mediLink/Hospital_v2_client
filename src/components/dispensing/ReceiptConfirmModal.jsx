/**
 * 수령 완료 확인 모달 컴포넌트
 */

function ReceiptConfirmModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className={`receipt-confirm-modal ${isOpen ? 'show' : ''}`}>
      <div className="receipt-confirm-overlay" onClick={onCancel}></div>
      <div className="receipt-confirm-content">
        <div className="receipt-confirm-header">
          <h3>수령 완료 확인</h3>
        </div>
        <div className="receipt-confirm-body">
          <p>수령을 완료하시겠습니까?</p>
        </div>
        <div className="receipt-confirm-actions">
          <button className="btn-cancel" onClick={onCancel}>취소</button>
          <button className="btn-confirm" onClick={onConfirm}>완료</button>
        </div>
      </div>
    </div>
  );
}

export default ReceiptConfirmModal;

