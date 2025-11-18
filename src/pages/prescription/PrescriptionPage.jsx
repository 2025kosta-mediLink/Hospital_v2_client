import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { prescriptionApi } from '../../api/prescription';
import AppLayout from '../../components/layout/AppLayout';
import PrescriptionList from '../../components/prescription/PrescriptionList';
import PrescriptionLoading from '../../components/prescription/PrescriptionLoading';
import PrescriptionError from '../../components/prescription/PrescriptionError';
import PrescriptionEmpty from '../../components/prescription/PrescriptionEmpty';
import '../../styles/prescriptionList.css';

const DEFAULT_MEMBER_ID = 20;

function PrescriptionPage() {
  const [memberId] = useState(DEFAULT_MEMBER_ID);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const navigate = useNavigate();

  const listQuery = useQuery({
    queryKey: ['prescriptions', memberId],
    queryFn: () => prescriptionApi.list(memberId),
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

  const handleStatusCheck = (prescriptionId) => {
    console.log('Check dispensing status:', prescriptionId);
    navigate(`/dispensing?prescriptionId=${prescriptionId}`);
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
    </AppLayout>
  );
}

export default PrescriptionPage;

