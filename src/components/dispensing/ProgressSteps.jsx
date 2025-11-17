/**
 * 조제 진행 단계 컴포넌트
 * 조제 현황의 진행 단계를 표시
 */

function ProgressSteps({ status }) {
  // 상태에 따른 단계 결정
  const getStepStatus = (stepNumber) => {
    if (!status) return 'pending';
    
    switch (status.status) {
      case 'RECEIVED':
        return stepNumber === 1 ? 'completed' : stepNumber === 2 ? 'current' : 'pending';
      case 'IN_PROGRESS':
        return stepNumber <= 1 ? 'completed' : stepNumber === 2 ? 'current' : 'pending';
      case 'COMPLETED':
        return stepNumber <= 2 ? 'completed' : stepNumber === 3 ? 'current' : 'pending';
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
      <div className={`step ${getStepStatus(2)}`}>
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
      <div className={`step ${getStepStatus(3)}`}>
        <div className="step-icon">
          <div className="step-circle"></div>
        </div>
        <div className="step-content">
          <div className="step-title">조제가 완료되었습니다.</div>
          {status?.completedAt && (
            <div className="step-time">완료 시간: {status.completedAt}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProgressSteps;

