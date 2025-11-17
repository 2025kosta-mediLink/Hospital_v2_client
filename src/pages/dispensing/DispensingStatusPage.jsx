import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { dispensingApi } from '../../api/dispensing';
import DispensingStatusContainer from './DispensingStatusContainer';
import ReceiptConfirmModal from '../../components/dispensing/ReceiptConfirmModal';
import '../../styles/dispensingStatus.css';

function DispensingStatusPage() {
  const [dispensingId] = useState('sample-dispensing');
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

  return (
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
        <div id="routeMap" className="route-map">
          지도 영역 (길찾기 API 연동 예정)
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
  );
}

export default DispensingStatusPage;

