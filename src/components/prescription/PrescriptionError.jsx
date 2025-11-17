/**
 * 처방전 에러 상태 컴포넌트
 */

function PrescriptionError({ message = "처방전을 불러오지 못했습니다." }) {
  return (
    <p>{message}</p>
  );
}

export default PrescriptionError;

