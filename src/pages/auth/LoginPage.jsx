// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import { login } from "../../api/authApi";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const errorFromState = (location.state?.error || "").trim();
  const messageFromState = (location.state?.message || "").trim();

  useEffect(() => {
    if (errorFromState) {
      alert(errorFromState);
    }
    if (messageFromState) {
      alert(messageFromState);
    }
  }, [errorFromState, messageFromState]);

  const headerProps = {
    // title 없음 (헤더는 보이지만 타이틀 비움)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = loginId.trim();
    const pw = password.trim();

    if (!id || !pw) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(id, pw);

      console.log("로그인 응답:", result);

      // 응답 구조: { isSuccess: true, code: "200", data: { ... } }
      if (result.isSuccess) {
        navigate("/"); // 홈으로 이동
      } else {
        alert(result.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("로그인 에러:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoSignUp = (e) => {
    e.preventDefault();
    navigate("/consent");
  };

  return (
    <AppLayout headerProps={headerProps}>
      <div className="mt-[84px] px-[22px] py-[28px] bg-white rounded-2xl shadow-md">
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
              className="w-full bg-transparent border-b border-slate-200 outline-none px-[6px] pt-[14px] pb-[16px] text-[16px] text-slate-900 caret-blue-600 placeholder-slate-400 focus:border-blue-600 disabled:opacity-50"
              id="loginId"
              name="loginId"
              type="text"
              autoComplete="username"
              required
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              disabled={isLoading}
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
              className="w-full bg-transparent border-b border-slate-200 outline-none px-[6px] pt-[14px] pb-[16px] text-[16px] text-slate-900 caret-blue-600 placeholder-slate-400 focus:border-blue-600 disabled:opacity-50"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button
            className="w-full mt-6 rounded-full bg-blue-600 text-white py-3 text-sm font-semibold shadow-sm active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
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
