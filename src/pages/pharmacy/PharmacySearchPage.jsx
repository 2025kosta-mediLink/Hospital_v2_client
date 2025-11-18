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
  
  // 병원 위치 (강북삼성병원 외래동) - 현재 위치로 사용
  const hospitalLatitude = 37.5685;
  const hospitalLongitude = 126.9672;
  
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

  // 약국 검색은 병원 위치 기준으로
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
      // 조제 현황 페이지로 이동
      navigate(`/dispensing?dispensingId=${dispensingId}`);
    },
  });

  const handlePharmacyClick = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setIsModalOpen(true);
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

  return (
    <AppLayout
      headerProps={{
        // title: '약국 찾기',
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 64px - 72px)', display: 'flex', flexDirection: 'column' }}>
        {/* 필터 바 */}
        <PharmacySearchForm
          filterOpen={filterOpen}
          onFilterChange={setFilterOpen}
        />

        {/* 지도 컨테이너 */}
        <div className="map-container" style={{ flex: '1', position: 'relative', minHeight: 0 }}>
          <KakaoMap
            latitude={latitude}
            longitude={longitude}
            pharmacies={filteredPharmacies}
            onPharmacyClick={handlePharmacyClick}
            userLocation={userLocation}
            hospitalLocation={null}
          />
        </div>

        {/* 약국 리스트 오버레이 */}
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

        {/* 약국 상세 모달 */}
        <PharmacyDetailModal
          pharmacy={selectedPharmacy}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
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

