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
  const [modalMessage, setModalMessage] = useState('');
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
    // 목록에서 해당 처방전 찾기
    const prescription = listQuery.data?.find(
      (p) => (p.prescriptionId ?? p.receptionId)?.toString() === prescriptionId?.toString()
    );
    
    if (prescription) {
      // 처방전 상세 페이지로 이동 (데이터 전달)
      navigate(`/prescription/${prescriptionId}`, {
        state: { prescription },
      });
    } else {
      // 데이터를 찾지 못한 경우에도 이동 (상세 페이지에서 다시 조회)
      navigate(`/prescription/${prescriptionId}`);
    }
  };

  const handleStatusCheck = async (prescriptionId, item) => {
    console.log('Check dispensing status:', prescriptionId, item);
    // 처방전 데이터에서 약국 정보 가져오기
    const prescription = item || listQuery.data?.find(p => (p.prescriptionId ?? p.receptionId) === prescriptionId);
    
    // dispensingId가 없으면 조제 상황 확인 불가 (약국 선택 전)
    if (!prescription?.dispensingId) {
      console.log('조제 상황 확인 불가: 약국을 선택하지 않았습니다.');
      // 모달 표시
      setModalMessage('아직 조제 신청이 되지 않았어요!');
      setIsNotDispensedModalOpen(true);
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
        setModalMessage('아직 조제 신청이 되지 않았어요!');
        setIsNotDispensedModalOpen(true);
        return;
      }
      
      // 조제가 시작된 경우 조제상황 페이지로 이동
      console.log('조제가 시작됨, 조제상황 페이지로 이동');
      const targetId = `dispensingId=${dispensingId}`;
      
      // 전달할 state 객체 생성
      const navigationState = {};
      
      if (prescription?.pharmacyName) {
        navigationState.pharmacyName = prescription.pharmacyName;
      }
      
      // 수령 날짜 정보 전달 (receivedAt, completedAt, completedDate 중 하나)
      if (prescription?.receivedAt) {
        navigationState.receivedAt = prescription.receivedAt;
      } else if (prescription?.completedAt) {
        navigationState.receivedAt = prescription.completedAt;
      } else if (prescription?.completedDate) {
        navigationState.receivedAt = prescription.completedDate;
      }
      
      navigate(`/dispensing?${targetId}`, {
        state: Object.keys(navigationState).length > 0 ? navigationState : undefined
      });
    } catch (error) {
      console.error('조제 상태 확인 실패:', error);
      console.log('에러 발생, 모달 표시');
      // 에러가 발생하면 모달 표시 (약국 선택 후 처방전 전달 전 상태일 가능성)
      setModalMessage('아직 조제 신청이 되지 않았어요!');
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
            {/* 아이콘 - 약상자 (응급처치 키트) */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-blue-600"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  {/* 약상자 바디 - 둥근 모서리 직사각형 */}
                  <rect
                    x="4"
                    y="8"
                    width="16"
                    height="12"
                    rx="2"
                    fill="currentColor"
                  />
                  {/* 약상자 뚜껑 */}
                  <rect
                    x="5.5"
                    y="3.5"
                    width="13"
                    height="5.5"
                    rx="1.5"
                    fill="currentColor"
                  />
                  {/* 뚜껑 핸들/래치 - 작은 흰색 선 */}
                  <line
                    x1="11"
                    y1="4"
                    x2="13"
                    y2="4"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  {/* 십자가 표시 - 세로선 (균형잡힌 형태) */}
                  <rect
                    x="10.5"
                    y="11"
                    width="3"
                    height="6"
                    fill="white"
                    rx="0.5"
                  />
                  {/* 십자가 표시 - 가로선 (균형잡힌 형태) */}
                  <rect
                    x="8.5"
                    y="13"
                    width="7"
                    height="3"
                    fill="white"
                    rx="0.5"
                  />
                </svg>
              </div>
            </div>
            <div className="completion-notification-message" style={{ whiteSpace: 'pre-line' }}>{modalMessage}</div>
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

