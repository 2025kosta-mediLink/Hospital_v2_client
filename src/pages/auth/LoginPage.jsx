// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import { useAuth } from "../../contexts/AuthContext";
import AlertModal from "../../components/common/AlertModal";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin } = useAuth();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 알림 모달 상태
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const errorFromState = (location.state?.error || "").trim();
  const messageFromState = (location.state?.message || "").trim();

  useEffect(() => {
    if (errorFromState) {
      setAlertModal({
        isOpen: true,
        title: "알림",
        message: errorFromState,
        type: "error",
      });
    }
    if (messageFromState) {
      setAlertModal({
        isOpen: true,
        title: "알림",
        message: messageFromState,
        type: "info",
      });
    }
  }, [errorFromState, messageFromState]);

  const headerProps = {};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = loginId.trim();
    const pw = password.trim();

    if (!id || !pw) {
      setAlertModal({
        isOpen: true,
        title: "입력 오류",
        message: "아이디와 비밀번호를 입력해주세요.",
        type: "warning",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await authLogin(id, pw);

      if (result.isSuccess) {
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      } else {
        setAlertModal({
          isOpen: true,
          title: "로그인 실패",
          message: result.message || "로그인에 실패했습니다.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("로그인 에러:", error);
      setAlertModal({
        isOpen: true,
        title: "오류",
        message: error.message || "로그인 중 오류가 발생했습니다.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoSignUp = (e) => {
    e.preventDefault();
    navigate("/consent");
  };

  return (
    <>
      <AppLayout headerProps={headerProps}>
        <div className="mt-0 px-[22px] py-[28px] bg-white rounded-2xl">
          <div className="flex flex-col items-center mb-6">
            <img
              src="/images/logo.png"
              alt="로고"
              className="mb-4"
              style={{ maxWidth: "100px", height: "auto" }}
            />
            <div className="text-center text-[20px] font-extrabold tracking-[-0.02em] text-slate-900">
              로그인
            </div>
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

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </>
  );
}

export default LoginPage;
