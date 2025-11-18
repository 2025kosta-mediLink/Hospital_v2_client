import { useState, useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { dispensingApi } from '../../api/dispensing';
import { pharmacyApi } from '../../api/pharmacy';
import AppLayout from '../../components/layout/AppLayout';
import DispensingStatusContainer from './DispensingStatusContainer';
import ReceiptConfirmModal from '../../components/dispensing/ReceiptConfirmModal';
import KakaoMap from '../../components/map/KakaoMap';
import '../../styles/dispensingStatus.css';

function DispensingStatusPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispensingId = searchParams.get('dispensingId') || searchParams.get('prescriptionId');
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const statusQuery = useQuery({
    queryKey: ['dispensing', dispensingId],
    queryFn: () => dispensingApi.getStatus(dispensingId),
    enabled: Boolean(dispensingId),
    retry: false,
  });

  const completeMutation = useMutation({
    mutationFn: () => dispensingApi.complete(dispensingId),
    onSuccess: () => {
      statusQuery.refetch();
      setIsReceiptModalOpen(false);
    },
  });

  const handleCompleteClick = () => {
    setIsReceiptModalOpen(true);
  };

  // 병원 위치 (강북삼성병원 외래동)
  const hospitalLatitude = 37.5685;
  const hospitalLongitude = 126.9672;

  // 카카오 API로 약국 정보 가져오기
  const pharmacyInfoQuery = useQuery({
    queryKey: ['pharmacyInfo', statusQuery.data?.pharmacyName],
    queryFn: () => pharmacyApi.searchByName(
      statusQuery.data?.pharmacyName || '',
      hospitalLatitude,
      hospitalLongitude
    ),
    enabled: Boolean(statusQuery.data?.pharmacyName),
    retry: false,
  });

  // 약국 위치 (카카오 API에서 받아온 데이터)
  const pharmacyLatitude = pharmacyInfoQuery.data?.latitude;
  const pharmacyLongitude = pharmacyInfoQuery.data?.longitude;

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
    if (pharmacyLatitude && pharmacyLongitude && pharmacyInfoQuery.data) {
      return [{
        pharmacyId: pharmacyInfoQuery.data.pharmacyId || 'pharmacy',
        name: pharmacyInfoQuery.data.name || statusQuery.data?.pharmacyName || '약국',
        address: pharmacyInfoQuery.data.address || '',
        latitude: pharmacyLatitude,
        longitude: pharmacyLongitude,
        distanceMeters: 0,
        open: true,
        status: 'OPEN'
      }];
    }
    return [];
  }, [pharmacyLatitude, pharmacyLongitude, pharmacyInfoQuery.data, statusQuery.data]);

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

  return (
    <AppLayout
      headerProps={{
        // title: '조제 상황',
      }}
    >
      <div>
        {/* 지도 및 경로 안내 */}
        <div className="map-container">
          <div className="route-info-header">
            <span className="route-path">
              강북삼성병원 외래동 → <span id="pharmacyName">
                {statusQuery.data?.pharmacyName || '약국명'}
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
              hospitalLocation={{ latitude: hospitalLatitude, longitude: hospitalLongitude }}
              route={route}
            />
            {pharmacyInfoQuery.isLoading && (
              <div style={{ 
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '12px 24px',
                borderRadius: '8px',
                color: '#6b7280',
                zIndex: 1000
              }}>
                약국 정보를 불러오는 중...
              </div>
            )}
            {!pharmacyInfoQuery.isLoading && !pharmacyLatitude && !pharmacyLongitude && (
              <div style={{ 
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '12px 24px',
                borderRadius: '8px',
                color: '#6b7280',
                zIndex: 1000
              }}>
                약국 정보를 찾을 수 없습니다
              </div>
            )}
          </div>
        </div>

        {/* 조제 현황 */}
        <div className="dispensing-status">
          <DispensingStatusContainer
            dispensingId={dispensingId}
            onComplete={handleCompleteClick}
          />
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

