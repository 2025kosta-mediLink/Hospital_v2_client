import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { prescriptionApi } from '../../api/prescription';
import { dispensingApi } from '../../api/dispensing';
import AppLayout from '../../components/layout/AppLayout';
import PrescriptionList from '../../components/prescription/PrescriptionList';
import PrescriptionLoading from '../../components/prescription/PrescriptionLoading';
import PrescriptionError from '../../components/prescription/PrescriptionError';
import PrescriptionEmpty from '../../components/prescription/PrescriptionEmpty';
import '../../styles/prescriptionList.css';

function PrescriptionPage() {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isNotDispensedModalOpen, setIsNotDispensedModalOpen] = useState(false);
  const navigate = useNavigate();

  const listQuery = useQuery({
    queryKey: ['prescriptions'],
    queryFn: () => prescriptionApi.list(),
    retry: false, // API 서버가 없을 경우 빠르게 실패하도록
  });

  const handleSelect = (prescriptionId, checked) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(prescriptionId);
    } else {
      newSelected.delete(prescriptionId);
    }
    setSelectedIds(newSelected);
  };

  const handleFindPharmacy = () => {
    if (selectedIds.size === 0) {
      alert('처방전을 선택해주세요.');
      return;
    }
    // 약국 검색 페이지로 이동 (선택된 처방전 ID 전달)
    navigate('/pharmacy', { state: { prescriptionIds: Array.from(selectedIds) } });
  };

  const handleViewPrescription = (prescriptionId) => {
    console.log('View prescription:', prescriptionId);
    // 처방전 상세 보기 로직
  };

  const handleStatusCheck = async (prescriptionId, item) => {
    console.log('Check dispensing status:', prescriptionId, item);
    // 처방전 데이터에서 약국 정보 가져오기
    const prescription = item || listQuery.data?.find(p => (p.prescriptionId ?? p.receptionId) === prescriptionId);
    
    // dispensingId가 없으면 조제 상황 확인 불가 (약국 선택 전)
    if (!prescription?.dispensingId) {
      console.log('조제 상황 확인 불가: 약국을 선택하지 않았습니다.');
      return;
    }
    
    // dispensingId가 있으면 조제 상태 확인
    const dispensingId = prescription.dispensingId;
    
    try {
      const status = await dispensingApi.getStatus(dispensingId);
      console.log('조제 상태:', status);
      console.log('조제 상태 status 필드:', status?.status);
      console.log('조제 상태 receivedAt 필드:', status?.receivedAt);
      
      // 조제 상태가 null이거나 아직 시작되지 않은 경우
      // receivedAt이 없으면 아직 처방전이 약국에 전달되지 않은 상태
      if (!status || !status.receivedAt || status.receivedAt === null || status.receivedAt === '') {
        console.log('조제 신청이 되지 않음, 모달 표시');
        setIsNotDispensedModalOpen(true);
        return;
      }
      
      // 조제가 시작된 경우 조제상황 페이지로 이동
      console.log('조제가 시작됨, 조제상황 페이지로 이동');
      const targetId = `dispensingId=${dispensingId}`;
      
      if (prescription?.pharmacyName) {
        // 약국 이름이 있으면 약국 정보를 함께 전달
        navigate(`/dispensing?${targetId}`, {
          state: {
            pharmacyName: prescription.pharmacyName
          }
        });
      } else {
        navigate(`/dispensing?${targetId}`);
      }
    } catch (error) {
      console.error('조제 상태 확인 실패:', error);
      console.log('에러 발생, 모달 표시');
      // 에러가 발생하면 모달 표시 (약국 선택 후 처방전 전달 전 상태일 가능성)
      setIsNotDispensedModalOpen(true);
    }
  };

  return (
    <AppLayout
      headerProps={{
        // title: '출력 가능한 처방전 목록',
      }}
      hideHeader={false}
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-title">출력 가능한 처방전 목록</div>
          <div className="divider"></div>
        </div>

        {listQuery.isLoading && <PrescriptionLoading />}
        {listQuery.error && (
          <PrescriptionError message={`처방전을 불러오지 못했습니다: ${listQuery.error.message || '알 수 없는 오류'}`} />
        )}
        {listQuery.data && Array.isArray(listQuery.data) && listQuery.data.length === 0 && <PrescriptionEmpty />}
        {listQuery.data && Array.isArray(listQuery.data) && listQuery.data.length > 0 && (
          <>
            <PrescriptionList
              items={listQuery.data}
              selectedIds={Array.from(selectedIds)}
              onSelect={handleSelect}
              onView={handleViewPrescription}
              onStatusCheck={handleStatusCheck}
            />
          </>
        )}
      </div>

      {/* Find Pharmacy Button */}
      {listQuery.data && Array.isArray(listQuery.data) && listQuery.data.length > 0 && (
        <div className="pharmacy-btn-container">
          <button
            className="find-pharmacy-btn"
            onClick={handleFindPharmacy}
            disabled={selectedIds.size === 0}
          >
            약국 찾기
          </button>
        </div>
      )}

      {/* 아직 조제 신청이 되지 않았어요 모달 */}
      {isNotDispensedModalOpen && (
        <div className="completion-notification-modal" style={{ display: 'flex', zIndex: 3000 }}>
          <div className="completion-notification-overlay" onClick={() => setIsNotDispensedModalOpen(false)}></div>
          <div className="completion-notification-content">
            <div className="completion-notification-message">아직 조제 신청이 되지 않았어요!</div>
            <button 
              className="completion-notification-btn" 
              onClick={() => setIsNotDispensedModalOpen(false)}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default PrescriptionPage;

