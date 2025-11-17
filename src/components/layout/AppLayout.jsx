// src/components/layout/AppLayout.jsx
import React from "react";
import Header from "./Header";
import BottomNav from "./BottomNav";

/**
 * 전체 레이아웃
 * - 위: Header (옵션)
 * - 가운데: children (스크롤)
 * - 아래: BottomNav
 */
function AppLayout({ headerProps, hideHeader = false, children }) {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      {/* 모바일 프레임 역할 */}
      <div className="flex min-h-screen w-full max-w-[393px] flex-col bg-white">
        {/* 상단 헤더 - hideHeader가 false일 때만 표시 */}
        {!hideHeader && <Header {...headerProps} />}

        {/* 가운데만 스크롤 */}
        <main className="flex-1 overflow-y-auto">{children}</main>

        {/* 하단 네비게이션 */}
        <BottomNav />
      </div>
    </div>
  );
}

export default AppLayout;
