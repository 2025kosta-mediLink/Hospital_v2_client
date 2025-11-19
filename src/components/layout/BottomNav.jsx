// src/components/layout/BottomNav.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TABS = [
  { id: "reservation", label: "예약", path: "/reservation/departments" },
  { id: "reception", label: "접수", path: "/reception/departments" },
  { id: "home", label: "홈", path: "/" },
  {
    id: "prescription",
    label: "처방전",
    path: "/prescription",
    relatedPaths: ["/prescription", "/pharmacy", "/dispensing"],
  },
  {
    id: "mypage",
    label: "마이페이지",
    path: "/mypage",
    relatedPaths: ["/reservation/list", "/reception/list"],
  },
];

// 탭별 아이콘 경로 (public 기준)
const TAB_ICONS = {
  reservation: {
    active: "/images/icons/calendar_blue.png",
    inactive: "/images/icons/calendar_gray.png",
  },
  reception: {
    active: "/images/icons/clipboard_blue.png",
    inactive: "/images/icons/clipboard_gray.png",
  },
  home: {
    active: "/images/icons/home_blue.png",
    inactive: "/images/icons/home_gray.png",
  },
  prescription: {
    active: "/images/icons/pill_blue.png",
    inactive: "/images/icons/pill_gray.png",
  },
  mypage: {
    active: "/images/icons/person_blue.png",
    inactive: "/images/icons/person_gray.png",
  },
};

function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname || "/";

  const handleTabClick = (tab) => {
    // 마이페이지 클릭 시 예약 리스트로 이동
    if (tab.id === "mypage") {
      navigate("/reservation/list");
      return;
    }

    // 예약 또는 접수 클릭 시 from 정보 전달
    if (tab.id === "reservation" || tab.id === "reception") {
      navigate(tab.path, {
        state: { from: tab.id },
      });
    } else {
      navigate(tab.path);
    }
  };

  // 활성화 상태 체크 함수
  const isTabActive = (tab) => {
    // 홈은 정확히 일치
    if (tab.path === "/") {
      return currentPath === "/";
    }

    // 마이페이지는 /reservation/list 또는 /reception/list에서 활성화
    if (tab.id === "mypage") {
      return tab.relatedPaths.some((path) => currentPath === path);
    }

    // 처방전 탭은 관련 경로들에서 모두 활성화
    if (tab.relatedPaths && tab.id !== "mypage") {
      return tab.relatedPaths.some((path) => currentPath.startsWith(path));
    }

    // 예약/접수는 list 페이지를 제외하고 departments를 포함한 prefix로 체크
    if (tab.id === "reservation") {
      return (
        currentPath.startsWith("/reservation") &&
        currentPath !== "/reservation/list"
      );
    }
    if (tab.id === "reception") {
      return (
        currentPath.startsWith("/reception") &&
        currentPath !== "/reception/list"
      );
    }

    // 나머지는 prefix로 체크
    return currentPath.startsWith(tab.path);
  };

  return (
    <nav
      className="border-t border-slate-200 bg-white shrink-0"
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "393px",
        zIndex: 1000,
        backgroundColor: "#ffffff",
      }}
    >
      <div className="mx-auto max-w-[393px]">
        <div className="grid grid-cols-5 items-center">
          {TABS.map((tab) => {
            const isActive = isTabActive(tab);
            const icon = TAB_ICONS[tab.id];
            const iconSrc = icon
              ? isActive
                ? icon.active
                : icon.inactive
              : null;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab)}
                className="relative flex flex-col items-center justify-center py-1.5 text-xs"
                aria-label={tab.label}
                aria-current={isActive ? "page" : undefined}
              >
                {/* 활성 탭 하이라이트 배경 (원형) */}
                {isActive && (
                  <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 my-0.5 h-12 w-12 rounded-full bg-sky-50" />
                )}

                {/* 아이콘 */}
                <span className="relative flex items-center justify-center">
                  {iconSrc ? (
                    <img
                      src={iconSrc}
                      alt=""
                      className="relative z-10 h-6 w-6 object-contain"
                      aria-hidden="true"
                    />
                  ) : (
                    <span
                      className={`relative z-10 flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                        isActive
                          ? "border-sky-500 text-sky-500 bg-white"
                          : "border-slate-300 text-slate-400 bg-slate-50"
                      }`}
                    >
                      ●
                    </span>
                  )}
                </span>

                {/* 라벨 */}
                <span
                  className={`relative z-10 mt-0.5 text-[11px] font-medium ${
                    isActive ? "text-sky-600" : "text-slate-400"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default BottomNav;
