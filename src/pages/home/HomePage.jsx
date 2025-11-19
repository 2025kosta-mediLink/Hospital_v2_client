// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import { useAuth } from "../../context/AuthContext";
import { getTodayReservations } from "../../api/reservationApi";

function HomeContent() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [todayReservations, setTodayReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTodayReservations();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchTodayReservations = async () => {
    try {
      setLoading(true);
      const response = await getTodayReservations();
      if (response.isSuccess && response.data) {
        setTodayReservations(response.data);
      }
    } catch (error) {
      console.error("오늘의 예약 조회 실패:", error);
      setTodayReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const hasAppointment = todayReservations.length > 0;

  const quickItems = [
    {
      id: "reservation",
      label: "진료예약",
      icon: "/images/icons/calendar_blue.png",
      path: "/reservation/departments",
    },
    {
      id: "reception",
      label: "진료접수",
      icon: "/images/icons/clipboard_blue.png",
      path: "/reception/departments",
    },
    {
      id: "prescription",
      label: "처방전",
      icon: "/images/icons/pill_blue.png",
      path: "/prescription",
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      alert("로그아웃되었습니다.");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  const handleQuickAction = (path) => {
    navigate(path);
  };

  const handleReservationClick = () => {
    navigate("/reservation/today");
  };

  return (
    <div className="pb-5">
      {/* 히어로 영역 */}
      <section className="relative z-0">
        <div
          className="h-[250px] w-full bg-cover bg-center border-b border-slate-200 shadow-[0_18px_36px_rgba(0,0,0,0.18)]"
          style={{ backgroundImage: "url('/images/hero/hospital_1.png')" }}
        />
      </section>

      {/* 콘텐츠 컨테이너 */}
      <div className="-mt-7 px-4 space-y-4 relative z-10">
        {/* 오늘의 예약일정 패널 */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_28px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.06)]">
          <div className="flex items-center justify-center gap-2 mb-3">
            <img
              src="/images/icons/calendar_blue.png"
              alt="오늘의 예약일정"
              className="h-5 w-5 object-contain"
            />
            <h2 className="text-[17px] font-semibold text-slate-800">
              오늘의 예약일정
            </h2>
          </div>

          {loading ? (
            <p className="text-center text-[13px] font-medium text-slate-500 py-4">
              로딩 중...
            </p>
          ) : hasAppointment ? (
            <div className="space-y-2">
              {todayReservations.map((reservation, index) => (
                <button
                  key={reservation.reservationId}
                  onClick={handleReservationClick}
                  className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-left flex-1">
                    <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap text-[13px]">
                      <span className="font-semibold text-slate-900">
                        {reservation.departmentName}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600">
                        {reservation.doctorName}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-blue-600 font-medium">
                        {reservation.reservationTime}
                      </span>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-slate-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-[13px] font-medium text-slate-500 py-4">
              오늘 예약된 일정이 없습니다.
            </p>
          )}
        </section>

        {/* 퀵 액션 */}
        <section className="grid grid-cols-3 gap-3">
          {quickItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleQuickAction(item.path)}
              className="flex min-h-[110px] w-full flex-col items-center justify-center gap-2 rounded-[14px] border border-slate-200 bg-white px-3 py-3 text-center text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 active:scale-[0.99]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50">
                <img
                  src={item.icon}
                  alt={item.label}
                  className="h-5 w-5 object-contain"
                />
              </div>
              <span className="text-[14px] leading-5">{item.label}</span>
            </button>
          ))}
        </section>

        {/* 진료시간 안내 */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-2.5 flex items-center gap-2">
            <h2 className="text-[16px] font-semibold text-slate-900">
              진료시간 안내
            </h2>
          </div>

          <div className="space-y-1.5 text-[14px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">월~금</span>
              <span className="text-slate-900 font-medium">
                오전 9:00 ~ 오후 6:00
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">토</span>
              <span className="text-slate-900 font-medium">
                오전 9:00 ~ 오후 1:00
              </span>
            </div>
            <div className="h-px bg-slate-200 my-1.5" />
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">점심시간</span>
              <span className="text-slate-900 font-medium">
                오후 12:30 ~ 오후 1:30
              </span>
            </div>
          </div>
        </section>

        {/* 로그인/로그아웃 버튼 */}
        <section className="pt-2">
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full rounded-full border border-slate-300 bg-white text-slate-700 py-3 text-sm font-semibold shadow-sm hover:bg-slate-50 active:scale-[0.99] transition"
            >
              로그아웃
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="w-full rounded-full bg-blue-600 text-white py-3 text-sm font-semibold shadow-sm hover:bg-blue-700 active:scale-[0.99] transition"
            >
              로그인
            </button>
          )}
        </section>

        {/* 문의 푸터 */}
        <div className="pt-1 pb-2 flex flex-col items-center gap-1 text-[11px]">
          <p className="text-slate-500">문의사항이 있으면 언제든 연락주세요</p>
          <div className="flex items-center gap-3">
            <a
              href="tel:15881234"
              className="inline-flex items-center text-[12px] font-medium text-sky-600 hover:underline"
            >
              <span className="mr-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border border-sky-400 text-[9px] leading-none">
                ☎
              </span>
              1588-1234
            </a>
            <span className="h-3 w-px bg-slate-200" />
            <span className="inline-flex items-center text-[12px] text-slate-500">
              <span className="mr-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border border-slate-300 text-[9px] leading-none">
                ⏰
              </span>
              평일 09:00-18:00
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  // 홈은 상단 헤더 숨기고(이미지부터 나오게)
  const headerProps = { title: "홈" };

  return (
    <AppLayout headerProps={headerProps} hideHeader>
      <HomeContent />
    </AppLayout>
  );
}

export default HomePage;
