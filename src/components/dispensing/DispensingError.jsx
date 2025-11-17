/**
 * 조제 현황 에러 상태 컴포넌트
 */

function DispensingError({ message = "조제 정보를 불러오지 못했습니다." }) {
  return (
    <p>{message}</p>
  );
}

export default DispensingError;

