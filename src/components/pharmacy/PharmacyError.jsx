/**
 * 약국 에러 상태 컴포넌트
 */

function PharmacyError({ message = "약국 정보를 불러오지 못했습니다." }) {
  return (
    <p>{message}</p>
  );
}

export default PharmacyError;

