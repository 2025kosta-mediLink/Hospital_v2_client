import React from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";

function SignUpDonePage() {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate("/");
  };

  const headerProps = {
    title: "", // 빈 타이틀
  };

  return (
    <AppLayout headerProps={headerProps}>
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        {/* 완료 아이콘 (옵션) */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* 완료 메시지 */}
        <h2 className="text-[22px] font-extrabold text-slate-900 text-center tracking-[-0.02em] leading-relaxed">
          회원가입이
          <br />
          완료되었습니다
        </h2>

        {/* 확인 버튼 */}
        <button
          onClick={handleConfirm}
          className="mt-12 w-full max-w-[280px] rounded-full bg-blue-600 text-white py-3.5 text-[15px] font-semibold shadow-sm active:scale-[0.99] transition"
        >
          확인
        </button>
      </div>
    </AppLayout>
  );
}

export default SignUpDonePage;
