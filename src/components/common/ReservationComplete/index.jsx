import { useNavigate } from "react-router-dom";
import SuccessIcon from "./SuccessIcon";
import InfoCard from "./InfoCard";
import NoticeBox from "./NoticeBox";

/**
 * 예약/접수 완료 화면 공용 컴포넌트
 * @param {Object} props
 * @param {'reservation'|'reception'} props.type - 예약 또는 접수
 * @param {Object} props.data - 완료 데이터
 * @param {string} props.data.number - 예약번호 또는 접수번호
 * @param {string} props.data.departmentName - 진료과
 * @param {string} props.data.doctorName - 의사명
 * @param {string} props.data.appointmentDate - 예약일 (YYYY-MM-DD)
 * @param {string} props.data.appointmentTime - 예약시간 (HH:MM)
 * @param {string} [props.data.symptom] - 증상 (접수만)
 */
export default function ReservationComplete({ type = "reservation", data }) {
  const navigate = useNavigate();

  const config = {
    reservation: {
      title: "예약이 완료되었습니다",
      numberLabel: "예약번호",
      listPath: "/reservations/list",
      newPath: "/reservation/departments", // ✅ 수정: /hospital/departments → /reservation/departments
      listButtonText: "예약 내역 보기",
      newButtonText: "추가 예약하기",
      notices: [
        "진료 30분 전까지 접수를 완료해 주세요",
        "신분증과 건강보험증을 지참해 주세요",
        "예약 변경은 진료 1일 전까지 가능합니다",
      ],
    },
    reception: {
      title: "접수가 완료되었습니다",
      numberLabel: "접수번호",
      listPath: "/receptions/list",
      newPath: "/reception/departments",
      listButtonText: "접수 내역 보기",
      newButtonText: "추가 접수하기",
      notices: [
        "대기 순서는 접수 순서에 따라 달라질 수 있습니다",
        "신분증과 건강보험증을 지참해 주세요",
        "접수 후 30분 이내에 도착해 주세요",
      ],
    },
  };

  const currentConfig = config[type];

  const handleListClick = () => {
    navigate(currentConfig.listPath);
  };

  const handleNewClick = () => {
    navigate(currentConfig.newPath);
  };

  return (
    <div className="flex flex-col items-stretch px-6 py-5 pb-8 gap-5 w-full bg-white">
      {/* 성공 아이콘 */}
      <SuccessIcon />

      {/* 완료 메시지 */}
      <div className="text-center text-gray-900 text-[22px] font-bold leading-[29px]">
        {currentConfig.title}
      </div>

      {/* 정보 카드 */}
      <InfoCard
        type={type}
        numberLabel={currentConfig.numberLabel}
        data={data}
      />

      {/* 안내사항 */}
      <NoticeBox notices={currentConfig.notices} />

      {/* 버튼 */}
      <div className="flex gap-2 mt-6">
        <button
          onClick={handleNewClick}
          className="flex-1 flex items-center justify-center px-4 py-3 min-h-[40px] text-sm font-semibold rounded-[10px] bg-blue-600 text-white border border-transparent transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600/35"
        >
          {currentConfig.newButtonText}
        </button>
        <button
          onClick={handleListClick}
          className="flex-1 flex items-center justify-center px-4 py-3 min-h-[40px] text-sm font-semibold rounded-[10px] bg-gray-50 text-gray-900 border border-gray-200 transition-colors hover:bg-gray-200 hover:border-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600/35"
        >
          {currentConfig.listButtonText}
        </button>
      </div>
    </div>
  );
}
