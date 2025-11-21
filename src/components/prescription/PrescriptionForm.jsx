import { forwardRef } from 'react';

/**
 * 처방전 폼 컴포넌트
 * 처방전 정보를 폼 형식으로 표시
 * - 날짜: 오늘 날짜 (동적)
 * - 성명, 주민등록번호: 회원 정보 (동적)
 * - 조제기관의 명칭: 처방전 전달 시 업데이트되는 pharmacyName (동적)
 * - 나머지: 고정 데이터
 */

const PrescriptionForm = forwardRef(function PrescriptionForm({ prescription, memberInfo }, ref) {
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

  // 동적 데이터
  const todayDate = getTodayDate();
  // 회원 정보 (가입 시 입력한 정보)
  const patientName = memberInfo?.name || '-';
  const patientRrn = memberInfo?.rrn || '-';
  // 의사명 (접수 내역을 통해 처방전 생성 시 선택한 의사)
  const doctorName = prescription?.doctorName || '-';
  // 조제기관의 명칭 (약국 선택 전에는 비어있음, 처방전 전달 시 업데이트)
  const pharmacyName = prescription?.pharmacyName || '';

  return (
    <div className="prescription-form" ref={ref}>
      {/* 제목 */}
      <div className="prescription-title">처방전</div>

      {/* 환자 정보 및 의료기관 정보 */}
      <div className="prescription-info-section">
        {/* 왼쪽: 환자 정보 */}
        <div className="prescription-info-left">
          <div className="prescription-info-row">
            <span className="prescription-info-label">교부년월일 및 번호</span>
            <span className="prescription-info-value">{todayDate}</span>
          </div>
          <div className="prescription-info-row">
            <span className="prescription-info-label">성명</span>
            <span className="prescription-info-value">{patientName}</span>
          </div>
          <div className="prescription-info-row">
            <span className="prescription-info-label">주민등록번호</span>
            <span className="prescription-info-value">{patientRrn}</span>
          </div>
        </div>

        {/* 오른쪽: 의료기관 정보 */}
        <div className="prescription-info-right">
          <div className="prescription-info-row">
            <span className="prescription-info-label">요양기관번호:</span>
            <span className="prescription-info-value">{fixedData.hospitalId}</span>
          </div>
          <div className="prescription-info-row">
            <span className="prescription-info-label">의료기관</span>
            <span className="prescription-info-value">{fixedData.hospitalName}</span>
          </div>
          <div className="prescription-info-row">
            <span className="prescription-info-label">성명</span>
            <span className="prescription-info-value">{doctorName}</span>
          </div>
          <div className="prescription-info-row">
            <span className="prescription-info-label">면허공</span>
            <span className="prescription-info-value">{fixedData.licenseType}</span>
          </div>
          <div className="prescription-info-row">
            <span className="prescription-info-label">면허번호</span>
            <span className="prescription-info-value">{fixedData.licenseNumber}</span>
          </div>
          <div className="prescription-info-row">
            <span className="prescription-info-label">팩스</span>
            <span className="prescription-info-value">{fixedData.fax}</span>
          </div>
          <div className="prescription-info-row">
            <span className="prescription-info-label">E-mail 주소</span>
            <span className="prescription-info-value">{fixedData.email}</span>
          </div>
        </div>
      </div>

      {/* 참고사항 */}
      <div className="prescription-note">
        ※ 환자의 요구가 있는 때에는 질병분류기호를 게재하지 아니합니다.
      </div>

      {/* 처방의약품 명칭 테이블 */}
      <div className="prescription-medication-section">
        <div className="prescription-medication-title">처방의약품의 명칭</div>
        <table className="prescription-medication-table">
          <thead>
            <tr>
              <th>1회</th>
              <th>1일</th>
              <th>총 투약량 투여횟수 투여일수</th>
              <th>용법</th>
            </tr>
          </thead>
          <tbody>
            {/* 빈 행들 */}
            {[1, 2, 3, 4, 5].map((idx) => (
              <tr key={idx}>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 주사제 처방내역 및 조제시 참고사항 */}
      <div className="prescription-injection-section">
        <div className="prescription-injection-left">
          <div className="prescription-injection-title">
            주사제 처방내역 (원내 조제 □, 원외처방 □)
          </div>
          <div className="prescription-injection-content"></div>
          <div className="prescription-injection-content"></div>
          <div className="prescription-injection-content"></div>
        </div>
        <div className="prescription-injection-right">
          <div className="prescription-injection-title">조제시 참고사항</div>
          <div className="prescription-injection-content"></div>
          <div className="prescription-injection-content"></div>
          <div className="prescription-injection-content"></div>
        </div>
      </div>

      {/* 사용기간 */}
      <div className="prescription-usage-period">
        <div className="prescription-usage-row">
          <span className="prescription-info-label">사용기간</span>
          <span className="prescription-info-value">교부일로부터 ( )일간</span>
        </div>
        <div className="prescription-usage-note">
          사용기간내에 약국에 제출하여야 합니다.
        </div>
      </div>

      {/* 의약품 조제 내역 */}
      <div className="prescription-dispensing-section">
        <div className="prescription-dispensing-left">
          <div className="prescription-info-row">
            <span className="prescription-info-label">조제기관의 명칭</span>
            <span className="prescription-info-value">{pharmacyName}</span>
          </div>
          <div className="prescription-info-row">
            <span className="prescription-info-label">조제약사 성명</span>
            <span className="prescription-info-value">
              {fixedData.pharmacistName} (서명 또는 날인)
            </span>
          </div>
          <div className="prescription-info-row">
            <span className="prescription-info-label">조제(조제일수)</span>
            <span className="prescription-info-value">{fixedData.dispensingDays}</span>
          </div>
          <div className="prescription-info-row">
            <span className="prescription-info-label">조제년월일</span>
            <span className="prescription-info-value">{todayDate}</span>
          </div>
        </div>
        <div className="prescription-dispensing-right">
          <div className="prescription-dispensing-note">
            처방의 변경·수정·확인 대체시 그 내용 등
          </div>
        </div>
      </div>
    </div>
  );
});

export default PrescriptionForm;

