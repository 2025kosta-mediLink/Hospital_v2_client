/**
 * 수령 완료 안내 페이지 컴포넌트
 * 처방전 수령이 완료된 경우 표시되는 안내 페이지
 */

function ReceiptCompletedPage({ pharmacyName, receivedAt }) {
  // 디버깅: receivedAt 값 확인
  console.log('[ReceiptCompletedPage] receivedAt:', receivedAt, typeof receivedAt);
  
  // 날짜 포맷팅 (예: 2025년 1월 15일)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      // 유효한 날짜인지 확인
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateString);
        return '';
      }
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      // NaN 체크
      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        console.warn('Invalid date values:', { year, month, day, dateString });
        return '';
      }
      return `${year}년 ${month}월 ${day}일`;
    } catch (e) {
      console.error('Date formatting error:', e, dateString);
      return '';
    }
  };

  return (
    <div className="receipt-completed-page">
      <div className="receipt-completed-content">
        <div className="receipt-completed-icon">
          <div className="check-circle">✓</div>
        </div>
        <div className="receipt-completed-message">
          {receivedAt && (
            <div className="receipt-completed-date">
              {formatDate(receivedAt)}
            </div>
          )}
          <div className="receipt-completed-pharmacy">
            {pharmacyName || '약국'}에서
          </div>
          <div className="receipt-completed-text">
            수령 완료되었습니다.
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReceiptCompletedPage;

