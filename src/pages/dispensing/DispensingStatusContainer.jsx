/**
 * 조제 현황 컨테이너 컴포넌트
 * 조제 상태 조회 및 알림 관리
 */

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dispensingApi } from '../../api/dispensing';
import DispensingStatusCard from '../../components/dispensing/DispensingStatusCard';
import CompletionNotificationModal from '../../components/dispensing/CompletionNotificationModal';

function DispensingStatusContainer({ dispensingId, onComplete, fromNotification, completedAt }) {
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
  
  // 알림으로 들어온 경우 또는 이미 알림을 받은 경우 즉시 완료 상태로 설정 (최우선)
  useEffect(() => {
    // 알림으로 들어온 경우
    if (fromNotification && completedAt) {
      setDisplayStatus(prev => ({
        ...prev,
        status: 'COMPLETED',
        completedAt: completedAt
      }));
      setAutoCompleted(true);
      return;
    }

    // 이미 알림을 받은 dispensingId인지 확인 (localStorage에서)
    if (dispensingId) {
      const notifiedIds = JSON.parse(localStorage.getItem('notifiedDispensingIds') || '[]');
      const dispensingIdStr = String(dispensingId);
      
      if (notifiedIds.includes(dispensingIdStr)) {
        // 저장된 completedAt 가져오기
        const completedAtMap = JSON.parse(localStorage.getItem('notifiedDispensingCompletedAt') || '{}');
        const savedCompletedAt = completedAtMap[dispensingIdStr] || new Date().toISOString();
        
        setDisplayStatus(prev => ({
          ...prev,
          status: 'COMPLETED',
          completedAt: savedCompletedAt
        }));
        setAutoCompleted(true);
      }
    }
  }, [fromNotification, completedAt, dispensingId]);

  // 백엔드 데이터가 로드되면 상태 업데이트 (알림을 받은 경우가 아닐 때만)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    // 알림으로 들어온 경우는 이미 완료 상태로 설정했으므로 건너뛰기
    if (fromNotification && completedAt) {
      return;
    }

    // 이미 알림을 받은 dispensingId인 경우도 건너뛰기
    if (dispensingId) {
      const notifiedIds = JSON.parse(localStorage.getItem('notifiedDispensingIds') || '[]');
      const dispensingIdStr = String(dispensingId);
      if (notifiedIds.includes(dispensingIdStr)) {
        return;
      }
    }

    if (statusQuery.data) {
      // 백엔드에서 실제 상태 확인
      const backendStatus = statusQuery.data.status;
      const backendCompletedAt = statusQuery.data.completedAt;
      
      // 백엔드에 완료 상태가 있는지 확인
      const hasBackendCompletedStatus = backendStatus === 'COMPLETED' 
        || backendStatus === 'READY' 
        || backendStatus === 'DONE'
        || (backendCompletedAt && new Date(backendCompletedAt) <= new Date());
      
      setDisplayStatus(prev => ({
        ...prev,
        dispenserName: statusQuery.data.dispenserName || prev.dispenserName,
        estimatedCompletionTime: statusQuery.data.estimatedCompletionTime || prev.estimatedCompletionTime,
        // 백엔드에 완료 상태가 있으면 사용, 없으면 IN_PROGRESS 유지 (10초 자동 완료 대기)
        ...(hasBackendCompletedStatus ? {
          status: 'COMPLETED',
          completedAt: backendCompletedAt || prev.completedAt
        } : {
          status: 'IN_PROGRESS' // 백엔드 상태가 없거나 진행 중이면 IN_PROGRESS 유지
        })
      }));
      
      // 백엔드에 완료 상태가 있으면 자동 완료 플래그 설정
      if (hasBackendCompletedStatus) {
        setAutoCompleted(true);
      }
    }
  }, [statusQuery.data, fromNotification, completedAt]);

  // 전역 이벤트 리스너: GlobalDispensingNotification에서 알림이 뜰 때 상태 업데이트
  useEffect(() => {
    const handleDispensingCompleted = (event) => {
      const { dispensingId: eventDispensingId, completedAt: eventCompletedAt } = event.detail || {};
      
      // 현재 dispensingId와 일치하는 경우에만 상태 업데이트
      if (eventDispensingId && String(eventDispensingId) === String(dispensingId)) {
        setDisplayStatus(prev => ({
          ...prev,
          status: 'COMPLETED',
          completedAt: eventCompletedAt || prev.completedAt
        }));
        setAutoCompleted(true);
      }
    };

    window.addEventListener('dispensingCompleted', handleDispensingCompleted);
    
    return () => {
      window.removeEventListener('dispensingCompleted', handleDispensingCompleted);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispensingId]);

  // 10초 후 자동 완료 처리 (백엔드에 완료 상태가 없고, 알림으로 들어온 경우가 아닐 때만 실행)
  useEffect(() => {
    if (!autoCompleted && dispensingId && !fromNotification) {
      // 백엔드 데이터가 로드되었지만 완료 상태가 없는 경우에만 실행
      const hasBackendCompletedStatus = statusQuery.data && (
        statusQuery.data.status === 'COMPLETED' 
        || statusQuery.data.status === 'READY' 
        || statusQuery.data.status === 'DONE'
        || (statusQuery.data.completedAt && new Date(statusQuery.data.completedAt) <= new Date())
      );
      
      // 백엔드에 완료 상태가 있으면 자동 완료 실행하지 않음
      if (hasBackendCompletedStatus) {
        return;
      }
      const timer = setTimeout(() => {
        const completedAt = new Date().toISOString();
        
        // 3단계를 완료 상태로 변경
        setDisplayStatus(prev => ({
          ...prev,
          status: 'COMPLETED',
          completedAt
        }));
        setAutoCompleted(true);
        
        // 전역 알림을 위한 이벤트 발생
        const event = new CustomEvent('dispensingCompleted', {
          detail: {
            dispensingId: String(dispensingId),
            completedAt
          },
          bubbles: true,
          cancelable: true
        });
        window.dispatchEvent(event);
        
        // 로컬 알림 모달도 표시 (조제상황 페이지에서)
        setIsCompletionModalOpen(true);
      }, 10000); // 10초 후

      return () => clearTimeout(timer);
    }
  }, [autoCompleted, dispensingId, fromNotification, statusQuery.data]);

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

