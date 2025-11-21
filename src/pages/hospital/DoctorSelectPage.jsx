import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/layout/Header";
import BottomNav from "../../components/layout/BottomNav";
import AlertModal from "../../components/common/AlertModal";
import { getDoctorsByDepartment, getDoctorNotices } from "../../api/doctorApi";
import { getAvailableTimeSlots } from "../../api/reservationApi";

function DoctorSelectPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { from, departmentId, departmentName } = location.state || {};

  const [doctors, setDoctors] = useState([]);
  const [allNotices, setAllNotices] = useState([]);
  const [currentDoctorIndex, setCurrentDoctorIndex] = useState(0);
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [noticeHeight, setNoticeHeight] = useState(96);
  const tabsRef = useRef(null);
  const noticeRef = useRef(null);

  // 모달 상태
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  // 모달 열기
  const showAlert = (message, type = "info", title = "") => {
    setAlertModal({
      isOpen: true,
      type,
      title,
      message,
    });
  };

  // 모달 닫기
  const closeAlert = () => {
    setAlertModal({
      isOpen: false,
      type: "info",
      title: "",
      message: "",
    });
  };

  // 의사 목록 조회
  useEffect(() => {
    if (!departmentId) {
      showAlert("진료과를 선택해주세요.", "warning");
      setTimeout(() => navigate(-1), 1500);
      return;
    }

    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const result = await getDoctorsByDepartment(departmentId);

        if (result.isSuccess && result.data) {
          setDoctors(result.data);

          // 모든 의사의 공지사항 수집
          const noticePromises = result.data.map((doctor) =>
            getDoctorNotices(doctor.doctorId).then((res) => ({
              doctorId: doctor.doctorId,
              doctorName: doctor.name,
              notices: res.isSuccess && res.data ? res.data : [],
            }))
          );

          const noticesData = await Promise.all(noticePromises);

          // 공지사항이 있는 것만 필터링하여 평탄화
          const flatNotices = noticesData
            .filter((item) => item.notices.length > 0)
            .flatMap((item) =>
              item.notices.map((notice) => ({
                ...notice,
                doctorId: item.doctorId,
                doctorName: item.doctorName,
              }))
            );

          setAllNotices(flatNotices);
        }
      } catch (error) {
        showAlert(error.message, "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, [departmentId, navigate]);

  // 공지사항 자동 슬라이드 (5초)
  useEffect(() => {
    if (allNotices.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentNoticeIndex((prev) => (prev + 1) % allNotices.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [allNotices.length]);

  // 의사 선택 + 자동 스크롤
  const handleSelectDoctor = (index) => {
    setCurrentDoctorIndex(index);

    // 선택된 탭을 중앙으로 스크롤
    setTimeout(() => {
      if (tabsRef.current) {
        const buttons = tabsRef.current.querySelectorAll("button");
        if (buttons[index]) {
          buttons[index].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      }
    }, 0);
  };

  // 다음 버튼 핸들러
  const handleNext = async () => {
    const selectedDoctor = doctors[currentDoctorIndex];

    if (from === "reservation") {
      // 예약: 바로 날짜/시간 선택으로 이동
      navigate("/reservation/datetime", {
        state: {
          from,
          departmentId,
          departmentName,
          doctorId: selectedDoctor.doctorId,
          doctorName: selectedDoctor.name,
        },
      });
    } else if (from === "reception") {
      // 접수: 오늘 진료 가능 여부만 확인
      try {
        const today = new Date().toISOString().split("T")[0];
        const result = await getAvailableTimeSlots(
          selectedDoctor.doctorId,
          today
        );

        // 안전하게 slots 추출
        let slots = { am: [], pm: [] };

        if (result && result.data) {
          slots = {
            am: Array.isArray(result.data.am) ? result.data.am : [],
            pm: Array.isArray(result.data.pm) ? result.data.pm : [],
          };
        }

        // 오전/오후 모두 진료 불가능한 경우
        if (slots.am.length === 0 && slots.pm.length === 0) {
          showAlert(
            `${selectedDoctor.name} 교수는 오늘 진료가 불가능합니다.\n다른 의사를 선택해주세요.`,
            "warning",
            "진료 불가"
          );
          return;
        }

        // 진료 가능하면 바로 증상 입력으로 이동
        navigate("/reception/symptom", {
          state: {
            from,
            departmentId,
            departmentName,
            doctorId: selectedDoctor.doctorId,
            doctorName: selectedDoctor.name,
          },
        });
      } catch (error) {
        console.error("진료 가능 여부 확인 실패:", error);

        if (error.message && error.message.includes("예약 가능 시간")) {
          showAlert(
            "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
            "error",
            "오류 발생"
          );
        } else {
          showAlert(
            error.message || "진료 가능 여부를 확인하는데 실패했습니다.",
            "error",
            "오류 발생"
          );
        }
      }
    }
  };

  const headerProps = {
    showBack: true,
    onBack: () => navigate(-1),
  };

  // 공지사항 높이 측정
  useEffect(() => {
    if (noticeRef.current) {
      const height = noticeRef.current.offsetHeight;
      setNoticeHeight(height);
    }
  }, [currentNoticeIndex, allNotices]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex justify-center">
        <div className="relative flex min-h-screen w-full max-w-[393px] flex-col bg-white items-center justify-center">
          <p className="text-slate-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="relative flex min-h-screen w-full max-w-[393px] flex-col bg-white">
        {/* 헤더 */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] z-50">
          <Header {...headerProps} />
        </div>

        {/* 공지사항 영역 */}
        <div
          ref={noticeRef}
          className="fixed top-14 left-1/2 -translate-x-1/2 w-full max-w-[393px] px-4 pt-4 pb-2 z-40 bg-white"
        >
          <div className="bg-[#E6F0FA] rounded-2xl p-4 text-center flex items-center justify-center">
            {allNotices.length > 0 ? (
              <div className="flex flex-col items-center gap-1 w-full">
                <p className="text-sm text-slate-900">
                  <span className="font-bold">
                    {allNotices[currentNoticeIndex].doctorName} 교수
                  </span>
                </p>
                <p className="text-sm text-slate-700 break-words whitespace-normal leading-relaxed px-2">
                  📢 {allNotices[currentNoticeIndex].content}
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-700 py-2">
                <span className="text-xl mr-2">📢</span>
                공지사항이 없습니다.
              </p>
            )}
          </div>
        </div>

        {/* 의사 이름 칩 */}
        <div
          className="fixed left-1/2 -translate-x-1/2 w-full max-w-[393px] h-16 z-40 bg-white"
          style={{ top: `${56 + noticeHeight}px` }}
        >
          <div className="relative py-3">
            <div
              ref={tabsRef}
              className="flex gap-2 overflow-x-auto scrollbar-hide px-4"
            >
              {doctors.map((doctor, index) => (
                <button
                  key={doctor.doctorId}
                  onClick={() => handleSelectDoctor(index)}
                  className={`flex-none px-5 py-2.5 rounded-full text-sm font-semibold transition whitespace-nowrap touch-manipulation ${
                    currentDoctorIndex === index
                      ? "bg-[#1E66F5] text-white shadow-md"
                      : "bg-[#F1F5F9] text-[#475569]"
                  }`}
                >
                  {doctor.name}
                </button>
              ))}
            </div>
            {/* 좌우 그라데이션 힌트 */}
            <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* 의사 카드 캐러셀 영역 */}
        <div
          className="fixed left-1/2 -translate-x-1/2 w-full max-w-[393px] px-4 bg-[#F8FAFC] z-30"
          style={{
            top: `${56 + noticeHeight + 64}px`,
            height: `calc(100vh - ${56 + noticeHeight + 64}px - 76px - 72px)`,
          }}
        >
          <div className="relative h-full overflow-hidden pt-4 pb-4">
            {doctors.map((doctor, index) => {
              const rel =
                (index - currentDoctorIndex + doctors.length) % doctors.length;

              let cardClass = "doctor-card-absolute";
              if (rel === 0) {
                cardClass += " card-current";
              } else if (rel === 1) {
                cardClass += " card-next";
              } else {
                cardClass += " card-hidden";
              }

              return (
                <div key={doctor.doctorId} className={cardClass}>
                  <div className="bg-white rounded-2xl shadow-lg p-5 mx-auto w-[90%] max-w-[360px] flex flex-col gap-3">
                    {/* 상단: 이름 + 프로필 */}
                    <div
                      className="flex items-center justify-between"
                      style={{ minHeight: "140px" }}
                    >
                      <div className="flex-1">
                        <h3 className="text-xl font-extrabold text-[#0F172A]">
                          {doctor.name}
                        </h3>
                      </div>
                      <div className="flex-[2] flex justify-end">
                        {doctor.profileImageUrl ? (
                          <img
                            src={doctor.profileImageUrl}
                            alt="프로필"
                            className="w-[66%] aspect-square object-cover rounded-xl border-2 border-[#E6EDF7]"
                          />
                        ) : (
                          <div className="w-[66%] aspect-square bg-slate-100 rounded-xl border-2 border-[#E6EDF7] flex items-center justify-center">
                            <svg
                              className="w-16 h-16 text-slate-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 하단: 주간 진료시간 */}
                    <div className="pt-1">
                      <p className="text-sm font-bold text-[#0F172A] mb-2">
                        주간 진료시간
                      </p>
                      <table className="w-full border-collapse text-center">
                        <thead>
                          <tr>
                            <th className="text-xs font-bold text-[#64748B] py-1 border-b border-[#EEF2F6]">
                              시간
                            </th>
                            <th className="text-xs font-bold text-[#64748B] py-1 border-b border-[#EEF2F6]">
                              월
                            </th>
                            <th className="text-xs font-bold text-[#64748B] py-1 border-b border-[#EEF2F6]">
                              화
                            </th>
                            <th className="text-xs font-bold text-[#64748B] py-1 border-b border-[#EEF2F6]">
                              수
                            </th>
                            <th className="text-xs font-bold text-[#64748B] py-1 border-b border-[#EEF2F6]">
                              목
                            </th>
                            <th className="text-xs font-bold text-[#64748B] py-1 border-b border-[#EEF2F6]">
                              금
                            </th>
                            <th className="text-xs font-bold text-[#64748B] py-1 border-b border-[#EEF2F6]">
                              토
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="py-2 font-bold text-[#0F172A] text-sm border-b border-[#EEF2F6]">
                              오전
                            </td>
                            {doctor.schedules.map((schedule) => (
                              <td
                                key={`am-${schedule.dayOfWeek}`}
                                className="py-2 border-b border-[#EEF2F6]"
                              >
                                <span
                                  className={
                                    schedule.amFlag
                                      ? "text-[#1E66F5] text-sm"
                                      : "text-[#E5EAF1] text-base"
                                  }
                                >
                                  {schedule.amFlag ? "●" : "–"}
                                </span>
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-2 font-bold text-[#0F172A] text-sm">
                              오후
                            </td>
                            {doctor.schedules.map((schedule) => (
                              <td
                                key={`pm-${schedule.dayOfWeek}`}
                                className="py-2"
                              >
                                <span
                                  className={
                                    schedule.pmFlag
                                      ? "text-[#1E66F5] text-sm"
                                      : "text-[#E5EAF1] text-base"
                                  }
                                >
                                  {schedule.pmFlag ? "●" : "–"}
                                </span>
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 하단 고정 버튼 */}
        <div className="fixed bottom-[72px] left-1/2 -translate-x-1/2 w-full max-w-[393px] bg-white p-4 z-40 border-t border-gray-100">
          <button
            onClick={handleNext}
            className="w-full rounded-xl bg-[#2563EB] text-white py-3.5 text-base font-bold shadow-sm active:scale-[0.99] transition"
          >
            다음
          </button>
        </div>

        {/* 하단 네비게이션 */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] z-50">
          <BottomNav />
        </div>

        {/* Alert 모달 */}
        <AlertModal
          isOpen={alertModal.isOpen}
          onClose={closeAlert}
          type={alertModal.type}
          title={alertModal.title}
          message={alertModal.message}
        />
      </div>
    </div>
  );
}

export default DoctorSelectPage;
