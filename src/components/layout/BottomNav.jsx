// src/components/layout/BottomNav.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TABS = [
  { id: "reservation", label: "예약", path: "/reservation" },
  { id: "reception", label: "접수", path: "/reception" },
  { id: "home", label: "홈", path: "/" },
  { id: "prescription", label: "처방전", path: "/prescription" },
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

  const handleTabClick = (path) => {
    navigate(path);
  };

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] h-16 bg-white border-t border-slate-200 flex items-center justify-around px-2 z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {TABS.map((tab) => {
        const isActive = currentPath === tab.path;
        const icon = isActive
          ? TAB_ICONS[tab.id].active
          : TAB_ICONS[tab.id].inactive;

        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.path)}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-2 cursor-pointer transition-colors"
            aria-label={tab.label}
            aria-current={isActive ? "page" : undefined}
          >
            <img
              src={icon}
              alt=""
              className="w-6 h-6 object-contain"
              aria-hidden="true"
            />
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
    </nav>
  );
}

export default BottomNav;
