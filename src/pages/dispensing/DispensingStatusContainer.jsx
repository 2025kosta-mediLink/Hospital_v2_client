/**
 * 조제 현황 컨테이너 컴포넌트
 * 조제 상태 조회 및 알림 관리
 */

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dispensingApi } from '../../api/dispensing';
import DispensingStatusCard from '../../components/dispensing/DispensingStatusCard';
import DispensingLoading from '../../components/dispensing/DispensingLoading';
import DispensingError from '../../components/dispensing/DispensingError';
import CompletionNotificationModal from '../../components/dispensing/CompletionNotificationModal';

function DispensingStatusContainer({ dispensingId, onComplete }) {
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [prevStatus, setPrevStatus] = useState(null);

  const statusQuery = useQuery({
    queryKey: ['dispensing', dispensingId],
    queryFn: () => dispensingApi.getStatus(dispensingId),
    enabled: Boolean(dispensingId),
    retry: false,
    refetchInterval: 5000, // 5초마다 상태 확인 (실제로는 WebSocket 사용 권장)
  });

  // 조제 완료 알림 모달 표시 로직
  useEffect(() => {
    const currentStatus = statusQuery.data?.status;
    const currentCompletedAt = statusQuery.data?.completedAt;
    
    // 이전 상태가 COMPLETED가 아니고, 현재 상태가 COMPLETED일 때 알림 표시
    if (prevStatus !== 'COMPLETED' && currentStatus === 'COMPLETED' && currentCompletedAt) {
      setIsCompletionModalOpen(true);
    }
    
    // 상태 업데이트
    if (currentStatus) {
      setPrevStatus(currentStatus);
    }
  }, [statusQuery.data, prevStatus]);

  return (
    <>
      {statusQuery.isLoading && <DispensingLoading />}
      {statusQuery.error && (
        <DispensingError message={`조제 정보를 불러오지 못했습니다: ${statusQuery.error.message || '알 수 없는 오류'}`} />
      )}
      {!statusQuery.isLoading && (
        <DispensingStatusCard
          status={statusQuery.data || (statusQuery.error ? { status: 'COMPLETED', receivedAt: null } : null)} // 에러 시 테스트용 기본값
          onComplete={onComplete}
        />
      )}

      {/* 조제 완료 알림 모달 */}
      <CompletionNotificationModal
        isOpen={isCompletionModalOpen}
        completedAt={statusQuery.data?.completedAt}
        onConfirm={() => setIsCompletionModalOpen(false)}
      />
    </>
  );
}

export default DispensingStatusContainer;

