// src/components/layout/BottomNav.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TABS = [
  { id: "reservation", label: "예약", path: "/reservation" },
  { id: "reception", label: "접수", path: "/reception" },
  { id: "home", label: "홈", path: "/" },
  { id: "prescription", label: "처방전", path: "/prescription", relatedPaths: ["/prescription", "/pharmacy", "/dispensing"] },
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

  return (
    <nav className="border-t border-slate-200 bg-white shrink-0">
      <div className="mx-auto max-w-[393px]">
        <div className="grid grid-cols-5 items-center">
          {TABS.map((tab) => {
            // 홈(/)은 정확히 일치
            // 처방전 탭은 관련 경로들(/prescription, /pharmacy, /dispensing)에서 모두 활성화
            // 나머지는 prefix로 체크
            let isActive;
            if (tab.path === "/") {
              isActive = currentPath === "/";
            } else if (tab.relatedPaths) {
              // 관련 경로가 정의된 경우 (처방전 탭)
              isActive = tab.relatedPaths.some(path => currentPath.startsWith(path));
            } else {
              isActive = currentPath.startsWith(tab.path);
            }

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
                onClick={() => navigate(tab.path)}
                className="relative flex flex-col items-center justify-center py-1.5 text-xs"
              >
                {/* 활성 탭 하이라이트 배경 (원형 느낌) */}
                {isActive && (
                  <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 my-0.5 h-12 w-12 rounded-full bg-sky-50" />
                )}

                {/* 아이콘 */}
                <span className="relative flex items-center justify-center">
                  {iconSrc ? (
                    <img
                      src={iconSrc}
                      alt={tab.label}
                      className="relative z-10 h-6 w-6 object-contain"
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
