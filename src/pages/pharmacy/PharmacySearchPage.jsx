import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { pharmacyApi } from '../../api/pharmacy';
import AppLayout from '../../components/layout/AppLayout';
import PharmacySearchForm from '../../components/pharmacy/PharmacySearchForm';
import PharmacyList from '../../components/pharmacy/PharmacyList';
import PharmacyLoading from '../../components/pharmacy/PharmacyLoading';
import PharmacyError from '../../components/pharmacy/PharmacyError';
import PharmacyEmpty from '../../components/pharmacy/PharmacyEmpty';
import PharmacyDetailModal from '../../components/pharmacy/PharmacyDetailModal';
import ConfirmModal from '../../components/pharmacy/ConfirmModal';
import KakaoMap from '../../components/map/KakaoMap';
import '../../styles/pharmacySearch.css';

function PharmacySearchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // PrescriptionPage에서 전달받은 처방전 ID들
  const prescriptionIds = location.state?.prescriptionIds || [];
  
  // 병원 위치 (강북삼성병원 외래동) - 현재 위치로 고정
  const hospitalLatitude = 37.5685;
  const hospitalLongitude = 126.9672;
  
  // 현재 위치 마커를 지도에서 보이는 위치로 조정하기 위한 오프셋
  // 위도 오프셋: 양수면 위로, 음수면 아래로 이동
  // 경도 오프셋: 양수면 오른쪽으로, 음수면 왼쪽으로 이동
  const markerOffsetLat = 0.002; // 위도 오프셋 (조절 가능)
  const markerOffsetLng = 0.000; // 경도 오프셋 (조절 가능: 더 오른쪽에 보이려면 값을 더 작게, 더 왼쪽에 보이려면 값을 더 크게)
  
  // 지도 중심점 (병원 위치로 고정)
  const [latitude, setLatitude] = useState(hospitalLatitude);
  const [longitude, setLongitude] = useState(hospitalLongitude);
  
  // 사용자 현재 위치 (병원 위치로 고정)
  const [userLocation] = useState({ latitude: hospitalLatitude, longitude: hospitalLongitude });
  
  const [radius, setRadius] = useState(2000);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(true);

  // 약국 검색은 병원 위치 기준
  const searchLatitude = hospitalLatitude;
  const searchLongitude = hospitalLongitude;
  
  const listQuery = useQuery({
    queryKey: ['pharmacies', searchLatitude, searchLongitude, radius],
    queryFn: () => pharmacyApi.search({ latitude: searchLatitude, longitude: searchLongitude, radius }),
    placeholderData: (previousData) => previousData,
    retry: false,
    enabled: Boolean(searchLatitude && searchLongitude),
  });

  const sendMutation = useMutation({
    mutationFn: (pharmacyId) =>
      pharmacyApi.send({ pharmacyId, prescriptionIds }),
    onSuccess: (response) => {
      // response에서 dispensingId 추출
      const dispensingId = response.dispensingId;
      // 모달 닫기
      setIsModalOpen(false);
      setIsConfirmModalOpen(false);
      // 조제 현황 페이지로 이동 (약국 정보 전달)
      navigate(`/dispensing?dispensingId=${dispensingId}`, {
        state: {
          pharmacy: selectedPharmacy // 약국 정보 전달 (위도, 경도 포함)
        }
      });
    },
  });

  const handlePharmacyClick = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setIsModalOpen(true);
    // 약국 선택 시 지도 중심 이동하지 않음 (약국 마커 업데이트 시 자동으로 범위 조정됨)
  };

  const handleSendPrescription = () => {
    if (selectedPharmacy) {
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmSend = () => {
    if (selectedPharmacy) {
      sendMutation.mutate(selectedPharmacy.pharmacyId);
    }
  };


  // 필터링된 약국 리스트
  const filteredPharmacies = listQuery.data?.items?.filter(pharmacy => {
    if (filterOpen) {
      return pharmacy.open;
    }
    return true;
  }) || [];

  // 지도에 표시할 약국 리스트 (모달이 열려있으면 선택된 약국만, 아니면 전체 약국)
  const displayPharmacies = (isModalOpen || isConfirmModalOpen) && selectedPharmacy 
    ? [selectedPharmacy] 
    : filteredPharmacies;

  // 모달 닫기 핸들러
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPharmacy(null);
    // 지도 중심을 다시 병원 위치로 복원
    setLatitude(hospitalLatitude);
    setLongitude(hospitalLongitude);
  };

  return (
    <AppLayout
      headerProps={{
        // title: '약국 찾기',
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 64px - 72px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* 필터 바 - 헤더 바로 아래 */}
        <PharmacySearchForm
          filterOpen={filterOpen}
          onFilterChange={setFilterOpen}
        />

        {/* 지도 컨테이너 - 필터 바 아래 */}
        <div className="map-container" style={{ height: 'calc(55% - 44px)', position: 'relative', minHeight: 0 }}>
          <KakaoMap
            latitude={latitude}
            longitude={longitude}
            pharmacies={displayPharmacies}
            onPharmacyClick={handlePharmacyClick}
            userLocation={userLocation}
            hospitalLocation={null}
            markerOffset={{ lat: markerOffsetLat, lng: markerOffsetLng }}
          />
        </div>

        {/* 약국 리스트 오버레이 - 모달이 열려있을 때는 숨김 */}
        {!isModalOpen && !isConfirmModalOpen && (
          <>
        {listQuery.isLoading && <PharmacyLoading />}
        {listQuery.error && (
          <PharmacyError message={`약국 정보를 불러오지 못했습니다: ${listQuery.error.message || '알 수 없는 오류'}`} />
        )}
        {listQuery.data && filteredPharmacies.length === 0 && <PharmacyEmpty />}
        {listQuery.data && filteredPharmacies.length > 0 && (
          <PharmacyList
            pharmacies={filteredPharmacies}
            onSelect={handlePharmacyClick}
          />
            )}
          </>
        )}

        {/* 약국 상세 모달 */}
        <PharmacyDetailModal
          pharmacy={selectedPharmacy}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSend={handleSendPrescription}
        />

        {/* 확인 모달 */}
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          message={`${selectedPharmacy?.name || selectedPharmacy?.pharmacyName}에 처방전을 전달하시겠습니까?`}
          onConfirm={handleConfirmSend}
          onCancel={() => setIsConfirmModalOpen(false)}
        />
      </div>
    </AppLayout>
  );
}

export default PharmacySearchPage;

