import { useState, useMemo, useEffect, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { dispensingApi } from '../../api/dispensing';
import { pharmacyApi } from '../../api/pharmacy';
import { prescriptionApi } from '../../api/prescription';
import AppLayout from '../../components/layout/AppLayout';
import DispensingStatusContainer from './DispensingStatusContainer';
import ReceiptConfirmModal from '../../components/dispensing/ReceiptConfirmModal';
import ReceiptCompletedPage from '../../components/dispensing/ReceiptCompletedPage';
import KakaoMap from '../../components/map/KakaoMap';
import '../../styles/dispensingStatus.css';

function DispensingStatusPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const dispensingId = searchParams.get('dispensingId') || searchParams.get('prescriptionId');
  const prescriptionId = searchParams.get('prescriptionId') || location.state?.prescriptionIds?.[0];
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const routeInfoHeaderRef = useRef(null);
  
  // 약국 검색 페이지에서 전달받은 약국 정보 및 처방전 ID
  const pharmacyFromState = location.state?.pharmacy;
  const prescriptionIdsFromState = location.state?.prescriptionIds;
  const pharmacyNameFromState = location.state?.pharmacyName; // 처방전 페이지에서 전달받은 약국 이름

  // 헤더 높이에 따라 route-info-header 위치 조정
  useEffect(() => {
    const updateHeaderPosition = () => {
      if (routeInfoHeaderRef.current) {
        const header = document.querySelector('header');
        if (header) {
          const headerHeight = header.offsetHeight || 64;
          routeInfoHeaderRef.current.style.top = `${headerHeight}px`;
        } else {
          routeInfoHeaderRef.current.style.top = '0px';
        }
      }
    };

    updateHeaderPosition();
    
    // ResizeObserver로 헤더 크기 변화 감지
    const header = document.querySelector('header');
    if (header) {
      const resizeObserver = new ResizeObserver(updateHeaderPosition);
      resizeObserver.observe(header);
      return () => resizeObserver.disconnect();
    }
  }, []);
  

  const statusQuery = useQuery({
    queryKey: ['dispensing', dispensingId],
    queryFn: () => dispensingApi.getStatus(dispensingId),
    enabled: Boolean(dispensingId),
    retry: false,
  });
  
  
  // 수령하기 버튼 클릭 후 수령 완료된 경우만 안내 페이지 표시
  // statusQuery가 로딩 중이거나 데이터가 없으면 false로 처리하여 지도 표시
  const isReceived = !statusQuery.isLoading && statusQuery.data?.status === 'RECEIVED_BY_USER';
  
  // receivedAt은 location.state에서 전달받은 값 우선 사용, 없으면 statusQuery에서 가져오기
  const receivedAt = location.state?.receivedAt 
    || statusQuery.data?.receivedAt;
    
  // pharmacyName도 location.state에서 전달받은 값 우선 사용
  const pharmacyNameForCompleted = location.state?.pharmacyName
    || statusQuery.data?.pharmacyName 
    || pharmacyFromState?.name 
    || pharmacyNameFromState;

  const completeMutation = useMutation({
    mutationFn: async () => {
      try {
        // 1. 수령 완료 처리
        await dispensingApi.complete(dispensingId);
        
        // 2. 처방전 상태 업데이트 (약국 이름, 수령 날짜)
        // 모든 처방전 ID에 대해 업데이트
        const prescriptionIdsToUpdate = prescriptionIdsFromState || (prescriptionId ? [prescriptionId] : []);
        const pharmacyName = pharmacyFromState?.name || statusQuery.data?.pharmacyName;
        const receivedAt = new Date().toISOString();
        
        if (prescriptionIdsToUpdate.length > 0) {
          // 모든 처방전에 대해 병렬로 업데이트
          await Promise.all(
            prescriptionIdsToUpdate.map(async (id) => {
              try {
                // prescriptionId를 숫자로 변환
                const prescriptionIdNum = typeof id === 'string' ? parseInt(id, 10) : id;
                if (isNaN(prescriptionIdNum)) {
                  console.error('Invalid prescriptionId:', id);
                  return;
                }
                await prescriptionApi.updateStatus(prescriptionIdNum, {
                  pharmacyName,
                  completedAt: receivedAt
                });
              } catch (error) {
                console.error('처방전 업데이트 실패, prescriptionId:', id, error);
                throw error;
              }
            })
          );
        }
      } catch (error) {
        console.error('수령 완료 처리 중 오류 발생:', error);
        throw error;
      }
    },
    onSuccess: () => {
      statusQuery.refetch();
      setIsReceiptModalOpen(false);
      
      // 처방전 목록 쿼리 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
      
      // 처방전 목록 페이지로 돌아가기
      navigate('/prescription');
    },
    onError: (error) => {
      console.error('수령 완료 처리 실패:', error);
      alert('수령 완료 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    },
  });

  const handleCompleteClick = () => {
    setIsReceiptModalOpen(true);
  };

  // 병원 위치 (강북삼성병원 외래동)
  const hospitalLatitude = 37.5685;
  const hospitalLongitude = 126.9672;

  // 약국 이름 결정: location.state > pharmacyFromState > statusQuery > pharmacyNameFromState 순으로 우선 사용
  const pharmacyName = location.state?.pharmacyName
    || pharmacyFromState?.name 
    || statusQuery.data?.pharmacyName 
    || pharmacyNameFromState;

  // 약국 위치: 약국 검색 페이지에서 전달받은 정보 우선 사용, 없으면 백엔드 응답 사용, 없으면 API로 가져오기
  const pharmacyInfoQuery = useQuery({
    queryKey: ['pharmacyInfo', pharmacyName],
    queryFn: () => pharmacyApi.searchByName(
      pharmacyName || '',
      hospitalLatitude,
      hospitalLongitude
    ),
    enabled: Boolean(pharmacyName && !pharmacyFromState && !statusQuery.data?.pharmacyLatitude),
    retry: false,
  });

  // 약국 위치 (약국 검색 페이지에서 전달받은 정보 > 백엔드 응답 > API 검색 순으로 우선 사용)
  const pharmacyLatitude = pharmacyFromState?.latitude 
    || (statusQuery.data?.pharmacyLatitude && statusQuery.data.pharmacyLatitude !== 0 ? statusQuery.data.pharmacyLatitude : null)
    || pharmacyInfoQuery.data?.latitude;
  const pharmacyLongitude = pharmacyFromState?.longitude 
    || (statusQuery.data?.pharmacyLongitude && statusQuery.data.pharmacyLongitude !== 0 ? statusQuery.data.pharmacyLongitude : null)
    || pharmacyInfoQuery.data?.longitude;
  

  // 지도 중심점 계산 (병원과 약국의 중간점)
  const mapCenter = useMemo(() => {
    if (pharmacyLatitude && pharmacyLongitude) {
      return {
        latitude: (hospitalLatitude + pharmacyLatitude) / 2,
        longitude: (hospitalLongitude + pharmacyLongitude) / 2
      };
    }
    return {
      latitude: hospitalLatitude,
      longitude: hospitalLongitude
    };
  }, [pharmacyLatitude, pharmacyLongitude]);

  // 약국 마커용 데이터 (KakaoMap 컴포넌트 형식에 맞춤)
  const pharmacyMarker = useMemo(() => {
    if (pharmacyLatitude && pharmacyLongitude) {
      const pharmacyData = pharmacyFromState || pharmacyInfoQuery.data || statusQuery.data;
      return [{
        pharmacyId: pharmacyData?.pharmacyId || 'pharmacy',
        name: pharmacyName || pharmacyData?.name || statusQuery.data?.pharmacyName || '약국',
        address: pharmacyData?.address || statusQuery.data?.pharmacyAddress || '',
        latitude: pharmacyLatitude,
        longitude: pharmacyLongitude,
        distanceMeters: 0,
        open: true,
        status: 'OPEN'
      }];
    }
    return [];
  }, [pharmacyLatitude, pharmacyLongitude, pharmacyFromState, pharmacyInfoQuery.data, statusQuery.data]);

  // 경로 정보 (병원 -> 약국)
  const route = useMemo(() => {
    if (pharmacyLatitude && pharmacyLongitude) {
      return {
        start: {
          latitude: hospitalLatitude,
          longitude: hospitalLongitude
        },
        end: {
          latitude: pharmacyLatitude,
          longitude: pharmacyLongitude
        }
      };
    }
    return null;
  }, [pharmacyLatitude, pharmacyLongitude, hospitalLatitude, hospitalLongitude]);

  // 경로 정보 업데이트 핸들러
  const handleRouteInfoUpdate = ({ distance, duration }) => {
    const distanceElement = document.getElementById('routeDistance');
    const durationElement = document.getElementById('routeDuration');
    
    if (distanceElement) {
      // 거리 표시 (미터를 적절한 단위로 변환)
      if (distance && distance > 0) {
        if (distance < 1000) {
          distanceElement.textContent = `${Math.round(distance)}m`;
        } else {
          distanceElement.textContent = `${(distance / 1000).toFixed(1)}km`;
        }
      } else {
        distanceElement.textContent = '-';
      }
    }
    
    if (durationElement) {
      // 시간 표시 (초를 분으로 변환)
      if (duration != null && duration >= 0) {
        const durationMin = Math.max(1, Math.round(duration / 60)); // 최소 1분
        durationElement.textContent = `${durationMin}분`;
      } else {
        durationElement.textContent = '-';
      }
    }
  };

  return (
    <AppLayout
      headerProps={{
        // title: '조제 상황',
        leftSlot: <div style={{ width: '44px', height: '44px' }} />, // 뒤로가기 버튼 숨김
        rightSlot: (
          <button
            type="button"
            onClick={() => navigate('/prescription')}
            aria-label="처방전 목록으로"
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-slate-100 active:scale-95 transition"
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              className="text-slate-500"
              aria-hidden="true"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ),
      }}
    >
      <div>
        {/* 지도 및 경로 안내 - 수령 완료된 경우 표시하지 않음 */}
        {!isReceived && (
        <div className="map-container">
          {/* 경로 정보 헤더 - 지도 위에 고정 */}
          <div className="route-info-header" ref={routeInfoHeaderRef}>
            <span className="route-path">
              강북삼성병원 외래동 → <span id="pharmacyName">
                {pharmacyName || pharmacyFromState?.name || pharmacyInfoQuery.data?.name || statusQuery.data?.pharmacyName || '약국명'}
              </span>
            </span>
            <div className="route-details" id="routeDetails">
              <span className="route-distance" id="routeDistance">-</span>
              <span className="route-duration" id="routeDuration">-</span>
            </div>
          </div>
          <div className="route-map">
            <KakaoMap
              latitude={mapCenter.latitude}
              longitude={mapCenter.longitude}
              pharmacies={pharmacyMarker}
              onPharmacyClick={() => {}}
              userLocation={{ latitude: hospitalLatitude, longitude: hospitalLongitude }}
              hospitalLocation={null}
              route={route}
              useIndexScript={true}
              onRouteInfoUpdate={handleRouteInfoUpdate}
            />
            {!pharmacyFromState && pharmacyInfoQuery.isLoading && (
              <div style={{ 
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '16px 24px',
                borderRadius: '12px',
                color: '#6b7280',
                fontSize: '14px',
                fontWeight: '500',
                zIndex: 1000,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}>
                약국 정보를 불러오는 중...
              </div>
            )}
            {!pharmacyFromState && !pharmacyInfoQuery.isLoading && !pharmacyLatitude && !pharmacyLongitude && (
              <div style={{ 
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '16px 24px',
                borderRadius: '12px',
                color: '#6b7280',
                fontSize: '14px',
                fontWeight: '500',
                zIndex: 1000,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}>
                약국 정보를 찾을 수 없습니다
              </div>
            )}
          </div>
        </div>
        )}

        {/* 조제 현황 또는 수령 완료 안내 */}
        <div className="dispensing-status">
          {isReceived ? (
            <ReceiptCompletedPage
              pharmacyName={pharmacyNameForCompleted}
              receivedAt={receivedAt}
            />
          ) : (
            <DispensingStatusContainer
              dispensingId={dispensingId}
              onComplete={handleCompleteClick}
              fromNotification={location.state?.fromNotification}
              completedAt={location.state?.completedAt}
            />
          )}
        </div>

        {/* 수령 완료 확인 모달 */}
        <ReceiptConfirmModal
          isOpen={isReceiptModalOpen}
          onConfirm={() => completeMutation.mutate()}
          onCancel={() => setIsReceiptModalOpen(false)}
        />
      </div>
    </AppLayout>
  );
}

export default DispensingStatusPage;

