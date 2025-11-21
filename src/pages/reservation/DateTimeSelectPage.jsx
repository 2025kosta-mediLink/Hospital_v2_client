import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/layout/Header";
import BottomNav from "../../components/layout/BottomNav";
import Calendar from "../../components/common/Calendar";
import TimeSlotGrid from "../../components/common/TimeSlotGrid";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import {
  getAvailableTimeSlots,
  createReservation,
  getReservationDetail,
} from "../../api/reservationApi";

function DateTimeSelectPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { from, _departmentId, departmentName, doctorId, doctorName } =
    location.state || {};

  // 상태 관리
  const [selectedDate, setSelectedDate] = useState(null); // YYYY-MM-DD
  const [selectedTime, setSelectedTime] = useState(null); // HH:MM
  const [amSlots, setAmSlots] = useState([]);
  const [pmSlots, setPmSlots] = useState([]);
  const [bookedTimes, setBookedTimes] = useState([]); // 예약된 시간 목록 추가
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // 날짜 포맷 함수
  const formatDateToString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 날짜 선택 가능 여부 체크 함수
  const isDateSelectable = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(dateStr);
    targetDate.setHours(0, 0, 0, 0);

    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 30);
    maxDate.setHours(0, 0, 0, 0);

    // 오늘 이후 && 30일 이내
    return targetDate >= today && targetDate <= maxDate;
  };

  // 날짜 선택 핸들러
  const handleDateSelect = async (dateStr) => {
    // 선택 불가능한 날짜 체크
    if (!isDateSelectable(dateStr)) {
      return;
    }

    setSelectedDate(dateStr);
    setSelectedTime(null);
    setAmSlots([]);
    setPmSlots([]);
    setBookedTimes([]); // 예약된 시간 초기화
    setIsLoading(true);

    try {
      const result = await getAvailableTimeSlots(doctorId, dateStr);

      // API 응답 구조에 따라 수정 필요
      setAmSlots(result.data.am || []);
      setPmSlots(result.data.pm || []);

      // 예약된 시간이 별도로 제공되는 경우
      setBookedTimes(result.data.booked || []);
    } catch (error) {
      console.error("시간 슬롯 조회 에러:", error);
      alert("예약 가능 시간을 불러오는데 실패했습니다.");
      setAmSlots([]);
      setPmSlots([]);
      setBookedTimes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 페이지 진입 시 doctorId 검증 및 오늘 날짜 자동 선택
  useEffect(() => {
    if (!doctorId) {
      alert("의사를 선택해주세요.");
      navigate(-1);
      return;
    }

    // 오늘 날짜 자동 선택
    const today = new Date();
    const todayStr = formatDateToString(today);
    handleDateSelect(todayStr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 빈 배열로 변경 - 최초 1회만 실행

  // 시간 선택 핸들러
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  // 예약하기 버튼
  const handleReservation = () => {
    if (!selectedDate || !selectedTime) {
      alert("날짜와 시간을 선택해주세요.");
      return;
    }
    setShowModal(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // 예약 확정
  const handleConfirmReservation = async () => {
    try {
      // 시간을 2자리로 포맷팅 (예: "9:30" -> "09:30")
      const [hours, minutes] = selectedTime.split(":");
      const formattedTime = `${hours.padStart(2, "0")}:${minutes.padStart(
        2,
        "0"
      )}:00`;

      // YYYY-MM-DD HH:MM:SS 형식으로 변환
      const appointmentAt = `${selectedDate} ${formattedTime}`;

      // 1️⃣ 예약 생성 (ID만 반환)
      const createResult = await createReservation({
        doctorId,
        appointmentAt,
      });

      if (createResult.isSuccess) {
        const reservationId = createResult.data; // 예약 ID (예: 59)

        // 2️⃣ 예약 상세 조회
        const detailResult = await getReservationDetail(reservationId);

        if (detailResult.isSuccess) {
          // 3️⃣ 완료 페이지로 이동
          navigate("/reservation/complete", {
            state: {
              data: {
                reservationId: reservationId,
                reservationNo:
                  detailResult.data.reservationNo ||
                  `RES-${String(reservationId).padStart(3, "0")}`,
                departmentName:
                  detailResult.data.departmentName || departmentName,
                doctorName: detailResult.data.doctorName || doctorName,
                appointmentDate:
                  detailResult.data.appointmentDate || selectedDate,
                appointmentTime:
                  detailResult.data.appointmentTime || selectedTime,
              },
            },
          });
        }
      }
    } catch (error) {
      console.error("예약 에러:", error);
      alert(error.message || "예약에 실패했습니다.");
    }
  };

  // 한글 날짜 포맷 (모달용)
  const formatKoreanDateTime = (dateStr, time) => {
    if (!dateStr || !time) return "";
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(
      2,
      "0"
    )}(${dayOfWeek}) ${time}`;
  };

  const headerProps = {
    showBack: true,
    onBack: () => navigate(-1),
  };

  // 모달에 전달할 데이터
  const modalData = {
    departmentName,
    doctorName,
    dateTime: formatKoreanDateTime(selectedDate, selectedTime),
  };

  return (
    <div className="flex min-h-screen justify-center bg-slate-100">
      <div className="relative flex min-h-screen w-full max-w-[393px] flex-col bg-white">
        {/* 헤더 - 고정 */}
        <div className="fixed left-1/2 top-0 z-50 w-full max-w-[393px] -translate-x-1/2">
          <Header {...headerProps} />
        </div>

        {/* 메인 콘텐츠 - 스크롤 */}
        <main className="flex-1 overflow-y-auto pb-[164px] pt-16">
          {/* 달력 섹션 */}
          <section className="mt-2">
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              isDateSelectable={isDateSelectable}
            />
          </section>

          {/* 시간 선택 섹션 */}
          {selectedDate && (
            <section className="mt-2 mb-4">
              <TimeSlotGrid
                amSlots={amSlots}
                pmSlots={pmSlots}
                bookedTimes={bookedTimes}
                selectedTime={selectedTime}
                onTimeSelect={handleTimeSelect}
                isLoading={isLoading}
              />
            </section>
          )}
        </main>

        {/* 예약하기 버튼 - 고정 */}
        <div className="fixed bottom-[72px] left-1/2 w-full max-w-[393px] -translate-x-1/2 border-t border-gray-200 bg-white px-4 py-4">
          <button
            onClick={handleReservation}
            disabled={!selectedDate || !selectedTime}
            className={`
              h-14 w-full rounded-xl text-base font-bold transition-colors
              ${
                selectedDate && selectedTime
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "cursor-not-allowed bg-gray-200 text-gray-400"
              }
            `}
          >
            {from === "reception" ? "접수하기" : "예약하기"}
          </button>
        </div>

        {/* 하단 네비게이션 - 고정 */}
        <div className="fixed bottom-0 left-1/2 w-full max-w-[393px] -translate-x-1/2">
          <BottomNav />
        </div>

        {/* 예약/접수 확인 모달 */}
        <ConfirmationModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onConfirm={handleConfirmReservation}
          data={modalData}
          type={from === "reception" ? "reception" : "reservation"}
        />
      </div>
    </div>
  );
}

export default DateTimeSelectPage;
