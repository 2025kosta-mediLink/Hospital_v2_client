import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { pharmacyApi } from '../../api/pharmacy';
import PharmacySearchForm from '../../components/pharmacy/PharmacySearchForm';
import PharmacyList from '../../components/pharmacy/PharmacyList';
import PharmacyLoading from '../../components/pharmacy/PharmacyLoading';
import PharmacyError from '../../components/pharmacy/PharmacyError';
import PharmacyEmpty from '../../components/pharmacy/PharmacyEmpty';
import PharmacyDetailModal from '../../components/pharmacy/PharmacyDetailModal';
import ConfirmModal from '../../components/pharmacy/ConfirmModal';
import '../../styles/pharmacySearch.css';

function PharmacySearchPage() {
  const [latitude, setLatitude] = useState(37.5665);
  const [longitude, setLongitude] = useState(126.9780);
  const [radius, setRadius] = useState(2000);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(true);

  const listQuery = useQuery({
    queryKey: ['pharmacies', latitude, longitude, radius],
    queryFn: () => pharmacyApi.search({ latitude, longitude, radius }),
    placeholderData: (previousData) => previousData,
    retry: false,
  });

  const sendMutation = useMutation({
    mutationFn: (pharmacyId) =>
      pharmacyApi.send({ pharmacyId, prescriptionIds: [1, 2] }),
    onSuccess: () => {
      setIsModalOpen(false);
      setIsConfirmModalOpen(false);
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
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      {/* 필터 바 */}
      <PharmacySearchForm
        filterOpen={filterOpen}
        onFilterChange={setFilterOpen}
      />

      {/* 지도 컨테이너 */}
      <div className="map-container">
        <div className="map-placeholder">
          지도 영역 (지도 API 연동 예정)
        </div>
        <button className="current-location-btn">📍</button>
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
        message={`${selectedPharmacy?.pharmacyName}에 처방전을 전달하시겠습니까?`}
        onConfirm={handleConfirmSend}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </div>
  );
}

export default PharmacySearchPage;

