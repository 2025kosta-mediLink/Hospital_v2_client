import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import { getTodayReservations } from "../../api/reservationApi";

function TodayReservationPage() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayReservations();
  }, []);

  const fetchTodayReservations = async () => {
    try {
      setLoading(true);
      const response = await getTodayReservations();

      if (response.isSuccess && response.data) {
        setReservations(response.data);
      } else {
        setReservations([]);
      }
    } catch (error) {
      console.error("오늘의 예약 조회 실패:", error);
      alert(error.message);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReception = (reservation) => {
    // 증상 선택 페이지로 이동하면서 예약 정보 전달
    navigate("/reception/symptom", {
      state: {
        type: "RESERVATION",
        reservationId: reservation.reservationId,
        reservationNo: reservation.reservationNo,
        departmentName: reservation.departmentName,
        doctorName: reservation.doctorName,
        doctorId: reservation.doctorId, // doctorId 추가
        reservationTime: reservation.reservationTime,
      },
    });
  };

  const headerProps = {
    title: "오늘 예약 내역",
    onBack: () => navigate(-1),
  };

  if (loading) {
    return (
      <AppLayout headerProps={headerProps}>
        <div className="flex items-center justify-center h-screen">
          <div className="text-slate-500">로딩 중...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout headerProps={headerProps}>
      <div className="p-4">
        <div className="mb-4">
          <div className="text-sm text-slate-600">
            {new Date().toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "short",
            })}
          </div>
        </div>

        {reservations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-slate-400 text-center">
              <div className="text-4xl mb-3">📅</div>
              <div className="text-sm">오늘 예약된 일정이 없습니다.</div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {reservations.map((reservation) => (
              <div
                key={reservation.reservationId}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="text-lg font-bold text-slate-900 mb-1">
                      {reservation.reservationTime}
                    </div>
                    <div className="text-sm text-slate-600 space-y-0.5">
                      <div>진료과: {reservation.departmentName}</div>
                      <div>의료진: {reservation.doctorName}</div>
                      <div className="text-xs text-slate-400">
                        예약번호: {reservation.reservationNo}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleReception(reservation)}
                  className="w-full rounded-full bg-blue-600 text-white py-3 text-sm font-semibold shadow-sm hover:bg-blue-700 active:scale-[0.99] transition"
                >
                  접수하기
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default TodayReservationPage;
