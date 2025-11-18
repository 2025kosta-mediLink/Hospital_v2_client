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
  { id: "mypage", label: "마이페이지", path: "/mypage" },
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

    // 처방전 탭은 관련 경로들에서 모두 활성화
    if (tab.relatedPaths) {
      return tab.relatedPaths.some((path) => currentPath.startsWith(path));
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
                onClick={() => handleTabClick(tab)}
                className="flex flex-col items-center justify-center gap-1 flex-1 py-2 cursor-pointer transition-colors"
                aria-label={tab.label}
                aria-current={isActive ? "page" : undefined}
              >
                {iconSrc && (
                  <img
                    src={iconSrc}
                    alt=""
                    className="w-6 h-6 object-contain"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={`text-[11px] font-medium ${
                    isActive ? "text-blue-600" : "text-slate-400"
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
