/**
 * 조제 현황 컨테이너 컴포넌트
 * 조제 상태 정보를 표시
 */

import ProgressSteps from './ProgressSteps';

function DispensingStatusCard({ status, onComplete, autoComplete = false }) {
  // 조건을 명확하게 분리
  const isCompleted = status?.status === 'COMPLETED';
  const isReceived = status?.status === 'RECEIVED_BY_USER';
  const hasReceivedAt = status?.receivedAt != null;
  
  // 버튼 활성화 조건: COMPLETED 상태이고 아직 수령하지 않았을 때
  const isButtonEnabled = isCompleted && !hasReceivedAt;
  
  return (
    <div className="status-container">
      {/* 조제 진행 상황 */}
      <ProgressSteps status={status} autoComplete={autoComplete} />

      {/* RECEIVED_BY_USER 상태일 때 완료 메시지 (ProgressSteps 아래) */}
      {isReceived && (
        <div className="completed-message">
          수령이 완료되었습니다.
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="action-buttons">
        {/* 버튼은 항상 표시, 조제 완료 상태일 때만 활성화 */}
        <button 
          className={`btn-complete-receipt ${isButtonEnabled ? 'enabled' : 'disabled'}`}
          onClick={isButtonEnabled ? onComplete : undefined}
          disabled={!isButtonEnabled}
        >
          수령 하기
        </button>
      </div>
    </div>
  );
}

export default DispensingStatusCard;

