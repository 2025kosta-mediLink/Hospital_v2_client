/**
 * 조제 현황 컨테이너 컴포넌트
 * 조제 상태 정보를 표시
 */

import ProgressSteps from './ProgressSteps';

function DispensingStatusCard({ status, onComplete }) {
  // 조건을 명확하게 분리
  const isCompleted = status?.status === 'COMPLETED';
  const isReceived = status?.status === 'RECEIVED_BY_USER';
  const hasReceivedAt = status?.receivedAt != null;
  
  // 버튼 활성화 조건: COMPLETED 상태이고 receivedAt이 없을 때, 또는 status가 없을 때 (테스트용)
  const isButtonEnabled = (!status || (isCompleted && !hasReceivedAt));
  
  return (
    <div className="status-container">
      {/* 조제 진행 상황 */}
      <ProgressSteps status={status} />

      {/* 액션 버튼 */}
      <div className="action-buttons">
        {/* 버튼은 항상 표시, 조제 완료 상태일 때만 활성화 */}
        <button 
          className={`btn-complete-receipt ${isButtonEnabled ? 'enabled' : 'disabled'}`}
          onClick={isButtonEnabled ? onComplete : undefined}
          disabled={!isButtonEnabled}
        >
          수령 완료
        </button>
        
        {/* RECEIVED_BY_USER 상태일 때 완료 메시지 */}
        {isReceived && (
          <div className="completed-message">
            수령이 완료되었습니다.
          </div>
        )}
      </div>
    </div>
  );
}

export default DispensingStatusCard;

