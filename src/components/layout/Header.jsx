// src/components/layout/Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * 공통 Header
 * - title: 가운데 타이틀 텍스트 (선택사항)
 * - leftSlot / rightSlot: 아이콘, 버튼 등 커스텀 엘리먼트 (선택사항)
 * - 뒤로가기 버튼: 항상 표시, history.back()으로 바로 전 페이지로 이동
 * - X 버튼: 항상 표시, 홈(/)으로 이동
 */
function Header({
  title,
  leftSlot,
  rightSlot,
  className = "",
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    window.history.back();
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <header
      className={`flex items-center justify-between h-16 px-4 border-b border-slate-200 bg-white shrink-0 ${className}`}
      style={{ 
        backgroundColor: '#ffffff', 
        zIndex: 1000, 
        position: 'sticky',
        top: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        padding: '0 16px',
        borderBottom: '1px solid #e5e7eb',
        minHeight: '64px',
        width: '100%',
        flexShrink: 0,
        boxSizing: 'border-box'
      }}
    >
      {/* 왼쪽 영역: 우선순위 - leftSlot > 기본 뒤로가기 버튼 */}
      <div className="flex items-center justify-start w-16">
        {leftSlot ? (
          leftSlot
        ) : (
          <button
            type="button"
            onClick={handleBack}
            aria-label="뒤로가기"
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-slate-100 active:scale-95 transition"
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              className="text-slate-500"
              aria-hidden="true"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* 가운데 타이틀 */}
      <div className="flex-1 flex justify-center">
        {title && (
          <h1 className="text-[15px] font-semibold text-slate-800 truncate">
            {title}
          </h1>
        )}
      </div>

      {/* 오른쪽 영역: 우선순위 - rightSlot > 기본 X 버튼 */}
      <div className="flex items-center justify-end w-16">
        {rightSlot ? (
          rightSlot
        ) : (
          <button
            type="button"
            onClick={handleClose}
            aria-label="홈으로"
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-slate-100 active:scale-95 transition"
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              className="text-slate-500"
              aria-hidden="true"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;

