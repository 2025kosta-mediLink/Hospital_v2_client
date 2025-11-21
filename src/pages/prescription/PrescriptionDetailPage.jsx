import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { prescriptionApi } from '../../api/prescription';
import { getMyInfo } from '../../api/authApi';
import AppLayout from '../../components/layout/AppLayout';
import PrescriptionForm from '../../components/prescription/PrescriptionForm';
import '../../styles/prescriptionDetail.css';

function PrescriptionDetailPage() {
  const { prescriptionId } = useParams();
  const location = useLocation();
  const [prescriptionData, setPrescriptionData] = useState(null);
  const prescriptionFormRef = useRef(null);

  // location.state에서 전달받은 처방전 데이터 사용
  useEffect(() => {
    if (location.state?.prescription) {
      setPrescriptionData(location.state.prescription);
    }
  }, [location.state]);

  // 목록에서 데이터를 가져오지 못한 경우 API 호출
  const detailQuery = useQuery({
    queryKey: ['prescriptions', prescriptionId],
    queryFn: async () => {
      // 목록에서 해당 처방전 찾기
      const list = await prescriptionApi.list();
      const prescription = list.find(
        (p) => (p.prescriptionId ?? p.receptionId)?.toString() === prescriptionId
      );
      return prescription;
    },
    enabled: !prescriptionData && !!prescriptionId,
  });

  // 회원 정보 가져오기
  const memberQuery = useQuery({
    queryKey: ['memberInfo'],
    queryFn: async () => {
      try {
        const response = await getMyInfo();
        // ApiResponse 구조: { isSuccess, code, message, data }
        // data에 MemberInfoResponse가 포함됨
        return response;
      } catch (error) {
        console.error('회원 정보 가져오기 실패:', error);
        throw error;
      }
    },
    retry: false,
  });

  // 최종 데이터 결정
  const prescription = prescriptionData || detailQuery.data;
  
  // 회원 정보 추출 (ApiResponse.data 구조)
  const memberInfo = memberQuery.data?.data;

  // 오늘 날짜를 YYYY-MM-DD 형식으로 반환
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 고정 데이터
  const fixedData = {
    hospitalId: '12345678',
    hospitalName: '강북삼성병원',
    licenseType: '의사',
    licenseNumber: '123456',
    fax: '02-1234-5678',
    email: 'hospital@example.com',
    pharmacistName: '이소연',
    dispensingDays: '1일',
  };

  // PDF 다운로드 함수 - 화면에 표시된 처방전을 이미지로 캡처하여 PDF로 변환
  const handlePdfDownload = async () => {
    if (!prescriptionFormRef.current) {
      console.error('처방전 폼을 찾을 수 없습니다.');
      return;
    }

    try {
      // html2canvas와 jsPDF 동시 로드
      const [html2canvas, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      // 처방전 폼을 이미지로 캡처
      const canvas = await html2canvas.default(prescriptionFormRef.current, {
        scale: 2, // 고해상도
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');

      // PDF 생성
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // 이미지 비율 계산
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      // 이미지를 PDF에 추가
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

      // 파일 저장
      const todayDate = getTodayDate();
      const fileName = `처방전_${todayDate}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('PDF 다운로드 실패:', error);
      alert('PDF 다운로드 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 처방전 정보가 없는 경우
  if (!prescriptionId) {
    return (
      <AppLayout>
        <div className="prescription-detail-container">
          <div className="error-message">처방전 정보를 찾을 수 없습니다.</div>
        </div>
      </AppLayout>
    );
  }

  if (detailQuery.isLoading || memberQuery.isLoading) {
    return (
      <AppLayout>
        <div className="prescription-detail-container">
          <div className="loading-message">처방전을 불러오는 중...</div>
        </div>
      </AppLayout>
    );
  }

  if (!prescription) {
    return (
      <AppLayout>
        <div className="prescription-detail-container">
          <div className="error-message">처방전을 찾을 수 없습니다.</div>
        </div>
      </AppLayout>
    );
  }

  // 회원 정보 로딩 실패 시 경고 (기능은 계속 사용 가능)
  if (memberQuery.error) {
    console.error('회원 정보 로딩 실패:', memberQuery.error);
    // 에러가 있어도 처방전은 표시하되, 회원 정보는 기본값 사용
  }

  return (
    <AppLayout hideHeader={false}>
      <div className="prescription-detail-container">
        {/* 알림 배너 */}
        <div className="prescription-notification-banner">
          <span className="notification-icon">🔔</span>
          <span className="notification-text">해당 진료에 1개의 처방전이 있습니다.</span>
        </div>

        {/* 처방전 폼 */}
        <PrescriptionForm 
          ref={prescriptionFormRef}
          prescription={prescription} 
          memberInfo={memberInfo}
        />

        {/* PDF 다운로드 버튼 */}
        <div className="pdf-download-container">
          <button className="pdf-download-btn" onClick={handlePdfDownload}>
            PDF 다운 받기
          </button>
        </div>
      </div>
    </AppLayout>
  );
}

export default PrescriptionDetailPage;

