/**
 * 조제 진행 단계 컴포넌트
 * 조제 현황의 진행 단계를 표시
 */

function ProgressSteps({ status, autoComplete = false }) {
  // 날짜 포맷팅 (예: 25.11.18.14:20)
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

  // 상태에 따른 단계 결정
  const getStepStatus = (stepNumber) => {
    if (!status) {
      // autoComplete가 true이고 조제 중 상태일 때 3단계를 pending으로 표시
      if (autoComplete && stepNumber === 3) return 'pending';
      return 'pending';
    }
    
    switch (status.status) {
      case 'RECEIVED':
        // 1단계: 완료 (파란색 체크), 2단계: 진행 중 (파란색), 3단계: 대기 (검정색 빈 동그라미)
        return stepNumber === 1 ? 'completed' : stepNumber === 2 ? 'current' : 'pending';
      case 'IN_PROGRESS':
        // 1단계: 완료, 2단계: 완료 (조제 중이므로 체크 표시), 3단계: 대기
        return stepNumber <= 2 ? 'completed' : 'pending';
      case 'COMPLETED':
        // 모든 단계 완료
        return 'completed';
      default:
        return 'pending';
    }
  };

  return (
    <div className="progress-steps">
      {/* 1단계: 약국이 처방전을 수령 */}
      <div className={`step ${getStepStatus(1)}`}>
        <div className="step-icon">
          <div className="step-circle"></div>
        </div>
        <div className="step-content">
          <div className="step-title">약국이 처방전을 수령했습니다.</div>
        </div>
      </div>

      {/* 2단계: 조제 중 */}
      <div className={`step ${getStepStatus(2)}`} id="secondStep">
        <div className="step-icon">
          <div className="step-circle"></div>
        </div>
        <div className="step-content">
          <div className="step-title">약을 조제 중입니다.</div>
          {status?.dispenserName && status?.estimatedCompletionTime && (
            <div className="step-detail">
              (조제자 : {status.dispenserName}, 예상 완료 시간: {status.estimatedCompletionTime})
            </div>
          )}
        </div>
      </div>

      {/* 3단계: 조제 완료 */}
      <div className={`step ${getStepStatus(3)}`} id="completionStep">
        <div className="step-icon">
          <div className="step-circle"></div>
        </div>
        <div className="step-content">
          <div className="step-title">조제가 완료되었습니다.</div>
          {status?.completedAt && (
            <div className="step-time">완료 시간: {formatDate(status.completedAt)}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProgressSteps;

