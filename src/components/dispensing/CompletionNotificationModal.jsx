/**
 * 조제 완료 알림 모달 컴포넌트
 * 조제가 완료되었을 때 표시되는 알림 모달
 */

function CompletionNotificationModal({ isOpen, completedAt, onConfirm }) {
  if (!isOpen) return null;

  // 날짜 포맷팅 (예: 25.09.26.14:20)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}.${month}.${day}.${hours}:${minutes}`;
  };

  return (
    <div className="completion-notification-modal" style={{ display: isOpen ? 'flex' : 'none' }}>
      <div className="completion-notification-overlay"></div>
      <div className="completion-notification-content">
        <div className="completion-notification-character">
          <div className="medicine-bag">💊</div>
        </div>
        <div className="completion-notification-time">
          {completedAt ? formatDate(completedAt) : new Date().toLocaleString('ko-KR')}
        </div>
        <div className="completion-notification-message">약 조제가 완료되었습니다!</div>
        <button className="completion-notification-btn" onClick={onConfirm}>
          확인
        </button>
      </div>
    </div>
  );
}

export default CompletionNotificationModal;

