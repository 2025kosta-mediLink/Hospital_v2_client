// src/components/layout/Header.jsx
import React from "react";

/**
 * 공통 Header
 * - title: 가운데 타이틀 텍스트
 * - leftSlot / rightSlot: 아이콘, 버튼 등 커스텀 엘리먼트
 * - onBack / onClose: 전달되면 기본 아이콘 버튼 렌더링
 */
function Header({
  title,
  leftSlot,
  rightSlot,
  onBack,
  onClose,
  className = "",
}) {
  return (
    <header
      className={`flex items-center justify-between h-16 px-4 border-b border-slate-200 bg-white shrink-0 ${className}`}
    >
      {/* 왼쪽 영역: 우선순위 - leftSlot > onBack */}
      <div className="flex items-center justify-start w-16">
        {leftSlot ? (
          leftSlot
        ) : onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="뒤로가기"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 active:scale-95 transition"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-slate-500"
              aria-hidden="true"
            >
              <path
                d="M15 18L9 12L15 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : null}
      </div>

      {/* 가운데 타이틀 */}
      <div className="flex-1 flex justify-center">
        {title && (
          <h1 className="text-[15px] font-semibold text-slate-800 truncate">
            {title}
          </h1>
        )}
      </div>

      {/* 오른쪽 영역: 우선순위 - rightSlot > onClose */}
      <div className="flex items-center justify-end w-16">
        {rightSlot ? (
          rightSlot
        ) : onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="홈으로"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 active:scale-95 transition"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-slate-500"
              aria-hidden="true"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : null}
      </div>
    </header>
  );
}

export default Header;
