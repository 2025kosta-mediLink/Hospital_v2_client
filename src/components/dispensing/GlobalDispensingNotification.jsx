/**
 * 전역 조제 완료 알림 컴포넌트
 * 앱 전체에서 조제 완료 알림을 표시하고 관리
 */

import { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { prescriptionApi } from '../../api/prescription';
import { dispensingApi } from '../../api/dispensing';
import CompletionNotificationModal from './CompletionNotificationModal';
import '../../styles/dispensingStatus.css';

function GlobalDispensingNotification() {
  const navigate = useNavigate();
  const [notificationData, setNotificationData] = useState(null); // { dispensingId, prescriptionId, completedAt }
  const pendingTimersRef = useRef(new Map()); // { dispensingId: timerId }
  

  // 전역 이벤트 리스너: DispensingStatusContainer에서 자동 완료 시 발생
  useEffect(() => {
    const handleDispensingCompleted = async (event) => {
      const { dispensingId, completedAt } = event.detail || {};
      
      if (!dispensingId) {
        console.error('[GlobalNotification] dispensingId가 없음!');
        return;
      }
      
      // 이미 알림을 표시한 dispensingId인지 확인
      const notifiedIds = JSON.parse(localStorage.getItem('notifiedDispensingIds') || '[]');
      if (notifiedIds.includes(dispensingId)) {
        return;
      }
      
      // 처방전 목록에서 해당 dispensingId를 가진 처방전 찾기
      let prescriptionId = null;
      try {
        const prescriptions = await prescriptionApi.list();
        const prescription = prescriptions.find(p => String(p.dispensingId) === dispensingId);
        
        if (prescription) {
          prescriptionId = prescription.prescriptionId || prescription.receptionId;
        }
      } catch (error) {
        console.error('[GlobalNotification] 처방전 찾기 실패, 하지만 알림 표시:', error);
      }
      
      // 처방전을 찾지 못해도 알림 표시 (dispensingId만으로도 가능)
      setNotificationData({
        dispensingId,
        prescriptionId: prescriptionId || dispensingId, // prescriptionId가 없으면 dispensingId 사용
        completedAt,
      });
      
      // 알림 표시한 ID 저장
      notifiedIds.push(dispensingId);
      localStorage.setItem('notifiedDispensingIds', JSON.stringify(notifiedIds));
    };

    window.addEventListener('dispensingCompleted', handleDispensingCompleted);
    
    return () => {
      window.removeEventListener('dispensingCompleted', handleDispensingCompleted);
    };
  }, []);

  // 처방전 목록 조회 (주기적으로 확인)
  const prescriptionsQuery = useQuery({
    queryKey: ['prescriptions'],
    queryFn: () => prescriptionApi.list(),
    enabled: true,
    retry: false,
    refetchInterval: 10000, // 10초마다 갱신
    refetchOnWindowFocus: true,
  });

  // 조제 중인 처방전들의 dispensingId 추출 및 조제 상태 확인
  useEffect(() => {
    if (!prescriptionsQuery.data || prescriptionsQuery.isLoading) {
      return;
    }

    const checkDispensingStatus = async () => {
      const prescriptions = prescriptionsQuery.data || [];
      
      // 조제 중인 처방전 필터링 (dispensingId가 있고, 완료되지 않은 것)
      const dispensingPrescriptions = prescriptions.filter(
        p => p.dispensingId && !p.completed && !p.receivedAt
      );

      // 이미 알림을 표시한 dispensingId 목록 (localStorage 사용)
      const notifiedIds = JSON.parse(localStorage.getItem('notifiedDispensingIds') || '[]');

      // 각 조제 중인 처방전의 상태 확인
      for (const prescription of dispensingPrescriptions) {
        const dispensingIdStr = String(prescription.dispensingId);
        
        // 이미 알림을 표시한 경우 건너뛰기
        if (notifiedIds.includes(dispensingIdStr)) {
          continue;
        }

        try {
          const status = await dispensingApi.getStatus(dispensingIdStr);
          
          // 조제 완료 상태 확인 (COMPLETED, READY 또는 completedAt이 있는 경우)
          const isCompleted = status?.status === 'COMPLETED' 
            || status?.status === 'READY' 
            || status?.status === 'DONE'
            || (status?.completedAt && new Date(status.completedAt) <= new Date());
          
          if (isCompleted) {
            // 이미 완료된 경우 타이머가 있다면 정리
            if (pendingTimersRef.current.has(dispensingIdStr)) {
              clearTimeout(pendingTimersRef.current.get(dispensingIdStr));
              pendingTimersRef.current.delete(dispensingIdStr);
            }
            
            const completedAtTime = status.completedAt || new Date().toISOString();
            
            setNotificationData({
              dispensingId: dispensingIdStr,
              prescriptionId: prescription.prescriptionId || prescription.receptionId,
              completedAt: completedAtTime,
            });
            
            // 전역 이벤트 발생하여 조제상황 페이지 상태도 업데이트
            const event = new CustomEvent('dispensingCompleted', {
              detail: {
                dispensingId: dispensingIdStr,
                completedAt: completedAtTime
              },
              bubbles: true,
              cancelable: true
            });
            window.dispatchEvent(event);
            
            // 알림 표시한 ID와 completedAt 저장
            notifiedIds.push(dispensingIdStr);
            localStorage.setItem('notifiedDispensingIds', JSON.stringify(notifiedIds));
            
            // completedAt도 별도로 저장 (나중에 조제상황 페이지에서 사용)
            const completedAtMap = JSON.parse(localStorage.getItem('notifiedDispensingCompletedAt') || '{}');
            completedAtMap[dispensingIdStr] = completedAtTime;
            localStorage.setItem('notifiedDispensingCompletedAt', JSON.stringify(completedAtMap));
            
            break; // 한 번에 하나의 알림만 표시
          } else if ((status?.status == null || status?.completedAt == null) && !pendingTimersRef.current.has(dispensingIdStr)) {
            // 조제 완료 여부가 null인 경우 15초 타이머 시작
            const timerId = setTimeout(() => {
              const completedAtTime = new Date().toISOString();
              
              // 자동으로 완료 상태로 변경하고 알림 표시
              setNotificationData({
                dispensingId: dispensingIdStr,
                prescriptionId: prescription.prescriptionId || prescription.receptionId,
                completedAt: completedAtTime,
              });
              
              // 전역 이벤트 발생하여 조제상황 페이지 상태도 업데이트
              const event = new CustomEvent('dispensingCompleted', {
                detail: {
                  dispensingId: dispensingIdStr,
                  completedAt: completedAtTime
                },
                bubbles: true,
                cancelable: true
              });
              window.dispatchEvent(event);
              
              // 알림 표시한 ID와 completedAt 저장
              const currentNotifiedIds = JSON.parse(localStorage.getItem('notifiedDispensingIds') || '[]');
              if (!currentNotifiedIds.includes(dispensingIdStr)) {
                currentNotifiedIds.push(dispensingIdStr);
                localStorage.setItem('notifiedDispensingIds', JSON.stringify(currentNotifiedIds));
              }
              
              // completedAt도 별도로 저장
              const completedAtMap = JSON.parse(localStorage.getItem('notifiedDispensingCompletedAt') || '{}');
              completedAtMap[dispensingIdStr] = completedAtTime;
              localStorage.setItem('notifiedDispensingCompletedAt', JSON.stringify(completedAtMap));
              
              // 타이머 제거
              pendingTimersRef.current.delete(dispensingIdStr);
            }, 15000); // 15초
            
            // 타이머 저장
            pendingTimersRef.current.set(dispensingIdStr, timerId);
          }
        } catch (error) {
          console.error('[GlobalNotification] 조제 상태 확인 실패:', error);
        }
      }
    };

    // 어느 페이지에서든 조제 상태 확인
    checkDispensingStatus();
  }, [prescriptionsQuery.data, prescriptionsQuery.isLoading]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      const timers = pendingTimersRef.current;
      timers.forEach((timerId) => {
        clearTimeout(timerId);
      });
      timers.clear();
    };
  }, []);

  // 확인 버튼 클릭 핸들러 - 조제상황 페이지로 이동
  const handleConfirm = () => {
    if (notificationData) {
      const { dispensingId, prescriptionId, completedAt } = notificationData;
      // dispensingId가 있으면 우선 사용
      const targetId = dispensingId ? `dispensingId=${dispensingId}` : `prescriptionId=${prescriptionId}`;
      // 알림으로 들어온 것만 표시 (실제 상태는 백엔드에서 확인)
      navigate(`/dispensing?${targetId}`, {
        state: {
          fromNotification: true,
          completedAt: completedAt, // 백엔드 데이터가 없을 때만 사용
          dispensingId: dispensingId
        }
      });
      setNotificationData(null);
    }
  };

  // 모달 표시 여부 확인
  const isModalOpen = !!notificationData;

  return (
    <>
      <CompletionNotificationModal
        isOpen={isModalOpen}
        completedAt={notificationData?.completedAt}
        onConfirm={handleConfirm}
      />
    </>
  );
}

export default GlobalDispensingNotification;
