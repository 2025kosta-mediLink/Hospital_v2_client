// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const errorFromState = (location.state?.error || "").trim();

  useEffect(() => {
    if (errorFromState) {
      alert(errorFromState);
    }
  }, [errorFromState]);

  // ✅ 헤더바는 보이지만, 가운데 title 은 비움
  const headerProps = {
    // title: "로그인"  ← 제거
    // 필요하면 나중에 onBack, onClose 추가 가능
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const id = loginId.trim();
    const pw = password.trim();

    if (!id || !pw) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    // TODO: 실제 로그인 API 연동 위치
    console.log("submit login", { id, pw });
  };

  const handleGoSignUp = (e) => {
    e.preventDefault();
    navigate("/consent"); // 추후 약관 동의 라우트로 변경 가능
  };

  return (
    <AppLayout headerProps={headerProps}>
      {/* JSP: .card.auth */}
      <div className="mt-[84px] px-[22px] py-[28px] bg-white rounded-2xl shadow-md">
        {/* JSP: .card-title */}
        <div className="text-center text-[20px] font-extrabold tracking-[-0.02em] text-slate-900">
          로그인
        </div>

        <form
          id="loginForm"
          onSubmit={handleSubmit}
          className="mt-6"
          noValidate
        >
          <div className="my-5">
            <label
              className="block text-[14px] text-slate-500 mb-2 ml-[2px]"
              htmlFor="loginId"
            >
              아이디
            </label>
            <input
              className="w-full bg-transparent border-b border-slate-200 outline-none px-[6px] pt-[14px] pb-[16px] text-[16px] text-slate-900 caret-blue-600 placeholder-slate-400 focus:border-blue-600"
              id="loginId"
              name="loginId"
              type="text"
              autoComplete="username"
              required
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
            />
          </div>

          <div className="my-5">
            <label
              className="block text-[14px] text-slate-500 mb-2 ml-[2px]"
              htmlFor="password"
            >
              비밀번호
            </label>
            <input
              className="w-full bg-transparent border-b border-slate-200 outline-none px-[6px] pt-[14px] pb-[16px] text-[16px] text-slate-900 caret-blue-600 placeholder-slate-400 focus:border-blue-600"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="w-full mt-6 rounded-full bg-blue-600 text-white py-3 text-sm font-semibold shadow-sm active:scale-[0.99]"
            type="submit"
          >
            로그인
          </button>
        </form>

        <div className="mt-4 flex justify-center">
          <a
            id="goSignUp"
            href="#"
            onClick={handleGoSignUp}
            className="text-sm text-blue-600 font-medium underline underline-offset-2"
          >
            회원가입
          </a>
        </div>
      </div>
    </AppLayout>
  );
}

export default LoginPage;
