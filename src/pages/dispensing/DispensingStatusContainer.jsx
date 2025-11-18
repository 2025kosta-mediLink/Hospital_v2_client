/**
 * 조제 현황 컨테이너 컴포넌트
 * 조제 상태 조회 및 알림 관리
 */

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dispensingApi } from '../../api/dispensing';
import DispensingStatusCard from '../../components/dispensing/DispensingStatusCard';
import CompletionNotificationModal from '../../components/dispensing/CompletionNotificationModal';

function DispensingStatusContainer({ dispensingId, onComplete }) {
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [autoCompleted, setAutoCompleted] = useState(false);
  
  // 백엔드 API 호출 (실패해도 에러 표시하지 않음)
  const statusQuery = useQuery({
    queryKey: ['dispensing', dispensingId],
    queryFn: () => dispensingApi.getStatus(dispensingId),
    enabled: Boolean(dispensingId),
    retry: false,
    refetchOnWindowFocus: false,
  });
  
  // 예상 완료 시간 계산 헬퍼 함수 (현재 시간 + 10분)
  const calculateEstimatedTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 10);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
  // 기본 상태: 조제 중 (IN_PROGRESS)
  // 백엔드에서 가져온 데이터가 있으면 사용, 없으면 더미 데이터 사용
  const [displayStatus, setDisplayStatus] = useState({
    status: 'IN_PROGRESS',
    receivedAt: null, // 약국이 처방전을 수령한 시간 (초기에는 null)
    dispenserName: '이소연', // 기본값: 백엔드 데이터가 있으면 업데이트됨
    estimatedCompletionTime: calculateEstimatedTime(), // 기본값: 현재 시간 + 10분
    completedAt: null
  });
  
  // 백엔드 데이터가 로드되면 상태 업데이트
  useEffect(() => {
    if (statusQuery.data) {
      console.log('백엔드 조제 정보:', statusQuery.data);
      console.log('약사 이름:', statusQuery.data.dispenserName);
      console.log('예상 완료 시간:', statusQuery.data.estimatedCompletionTime);
      
      setDisplayStatus(prev => ({
        ...prev,
        dispenserName: statusQuery.data.dispenserName || prev.dispenserName,
        estimatedCompletionTime: statusQuery.data.estimatedCompletionTime || prev.estimatedCompletionTime,
      }));
    }
  }, [statusQuery.data]);

  // 10초 후 자동 완료 처리
  useEffect(() => {
    if (!autoCompleted) {
      const timer = setTimeout(() => {
        // 3단계를 완료 상태로 변경
        setDisplayStatus(prev => ({
          ...prev,
          status: 'COMPLETED',
          completedAt: new Date().toISOString()
        }));
        setAutoCompleted(true);
        
        // 알림 모달 표시
        setIsCompletionModalOpen(true);
      }, 10000); // 10초 후

      return () => clearTimeout(timer);
    }
  }, [autoCompleted]);

  // 수령 완료 핸들러
  const handleComplete = () => {
    // 상태를 수령 완료로 업데이트
    setDisplayStatus(prev => ({
      ...prev,
      status: 'RECEIVED_BY_USER',
      receivedAt: new Date().toISOString()
    }));
    
    // 부모 컴포넌트의 콜백 호출 (모달 열기 등)
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <>
      <DispensingStatusCard
        status={displayStatus}
        onComplete={handleComplete}
        autoComplete={!autoCompleted}
      />

      {/* 조제 완료 알림 모달 */}
      <CompletionNotificationModal
        isOpen={isCompletionModalOpen}
        completedAt={displayStatus?.completedAt}
        onConfirm={() => setIsCompletionModalOpen(false)}
      />
    </>
  );
}

export default DispensingStatusContainer;

