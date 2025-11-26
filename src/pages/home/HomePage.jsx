// src/pages/Home.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import { useAuth } from "../../context/AuthContext";
import { getTodayReservations } from "../../api/reservationApi";

function HomeContent() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [todayReservations, setTodayReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

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

  // 날짜/시간 포맷팅 함수
  const formatReservationDateTime = (reservationTime) => {
    if (!reservationTime) {
      return { date: "", time: "" };
    }
    try {
      let date;

      // reservationTime이 문자열인지 확인
      const timeStr = String(reservationTime);

      // ISO 형식 (2025-11-20T09:30:00 또는 2025-11-20T09:30:00.000Z)
      if (timeStr.includes("T")) {
        date = new Date(timeStr);
      }
      // 일반 형식 (2025-11-20 09:30:00)
      else if (timeStr.includes(" ")) {
        date = new Date(timeStr.replace(" ", "T"));
      }
      // HH:mm 형식인 경우 (백엔드가 아직 업데이트 안 된 경우)
      else if (timeStr.match(/^\d{2}:\d{2}$/)) {
        // 임시로 오늘 날짜 사용 (백엔드가 업데이트되면 이 부분은 제거됨)
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return {
          date: `${year}.${month}.${day}`,
          time: timeStr,
        };
      } else {
        date = new Date(timeStr);
      }

      // 유효한 날짜인지 확인
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", timeStr);
        throw new Error("Invalid date");
      }

      // 날짜 포맷: YYYY.MM.DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      // 시간 포맷: HH:MM
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return {
        date: `${year}.${month}.${day}`,
        time: `${hours}:${minutes}`,
      };
    } catch (e) {
      console.error(
        "formatReservationDateTime error:",
        e,
        "reservationTime:",
        reservationTime
      );
      return {
        date: "날짜 오류",
        time: reservationTime || "",
      };
    }
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
        {/* 로그인 안 된 경우: 로그인 & 가입하기 섹션 */}
        {!user ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_28px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.06)]">
            <button
              onClick={() => navigate("/login")}
              className="w-full flex items-center gap-3 hover:bg-slate-50 -m-4 p-4 rounded-2xl transition-colors"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 shrink-0 overflow-hidden">
                <img
                  src="/images/logo.png"
                  alt="로고"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[16px] font-bold text-slate-900">
                    로그인 & 가입하기
                  </span>
                  <svg
                    className="w-4 h-4 text-sky-500 shrink-0"
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
                </div>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  로그인하고 병원 서비스를 자유롭게 이용해보세요
                </p>
              </div>
            </button>
          </section>
        ) : (
          /* 로그인된 경우: 오늘의 예약일정 섹션 */
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_28px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.06)]">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <img
                    src="/images/icons/calendar_blue.png"
                    alt="오늘의 예약일정"
                    className="h-5 w-5 object-contain"
                  />
                  <h2 className="text-[17px] font-semibold text-slate-800">
                    {user.name || user.loginId}님의 예약일정
                  </h2>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-[12px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  로그아웃
                </button>
              </div>

              {loading ? (
                <p className="text-center text-[13px] font-medium text-slate-500 py-4">
                  로딩 중...
                </p>
              ) : hasAppointment ? (
                <div
                  ref={scrollContainerRef}
                  className="overflow-y-auto snap-y snap-mandatory scrollbar-hide relative rounded-2xl"
                  style={{
                    height: "140px",
                    scrollSnapType: "y mandatory",
                    WebkitOverflowScrolling: "touch",
                    paddingBottom: "4px",
                    paddingLeft: "4px",
                    paddingRight: "4px",
                    background:
                      "linear-gradient(135deg, rgba(240, 249, 255, 0.6) 0%, rgba(224, 242, 254, 0.6) 100%)",
                    backdropFilter: "blur(12px) saturate(180%)",
                    WebkitBackdropFilter: "blur(12px) saturate(180%)",
                  }}
                >
                  {todayReservations.map((reservation, index) => {
                    const dateTime = formatReservationDateTime(
                      reservation.reservationTime
                    );
                    return (
                      <div
                        key={reservation.reservationId}
                        className="snap-start snap-always flex items-center justify-center"
                        style={{
                          height: "140px",
                          flexShrink: 0,
                          marginBottom:
                            index < todayReservations.length - 1 ? "12px" : "0",
                        }}
                      >
                        <button
                          onClick={handleReservationClick}
                          className="w-full text-left p-4 hover:opacity-90 rounded-2xl transition-all cursor-pointer relative overflow-hidden group"
                          style={{
                            background: "rgba(255, 255, 255, 0.7)",
                            backdropFilter: "blur(20px) saturate(180%)",
                            WebkitBackdropFilter: "blur(20px) saturate(180%)",
                            height: "128px",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                            boxShadow:
                              "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
                          }}
                        >
                          {/* 진료과 */}
                          <div className="mb-3">
                            <h3 className="text-[16px] font-bold text-chagolBlue">
                              {reservation.departmentName}
                            </h3>
                          </div>

                          {/* 일정 */}
                          <div className="mb-2">
                            <span className="text-[13px] text-chagolBlue mr-2">
                              일정 :
                            </span>
                            <span className="text-[13px] font-medium text-chagolBlue">
                              {dateTime.date} / {dateTime.time}
                            </span>
                          </div>

                          {/* 담당의 */}
                          <div>
                            <span className="text-[13px] text-chagolBlu mr-2">
                              의료진 :
                            </span>
                            <span className="text-[13px] font-medium text-chagolBlu">
                              {reservation.doctorName}
                            </span>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-[13px] font-medium text-slate-500 py-4">
                  오늘 예약된 일정이 없습니다.
                </p>
              )}
            </div>
          </section>
        )}

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
