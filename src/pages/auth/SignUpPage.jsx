import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import { checkLoginId, signUp } from "../../api/authApi";

function SignUpPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const agreeMarketing = location.state?.agreeMarketing || false;

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [name, setName] = useState("");
  const [rrn, setRrn] = useState("");
  const [gender, setGender] = useState("F");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [idChecked, setIdChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ---------- 유틸리티 함수 ----------
  const onlyDigits = (s) => s.replace(/[^\d]/g, "");

  const phoneHyphen = (v) => {
    const d = onlyDigits(v).slice(0, 11);
    if (d.length < 4) return d;
    if (d.length < 7) return d.replace(/(\d{3})(\d+)/, "$1-$2");
    return d.replace(/(\d{3})(\d{3,4})(\d{0,4}).*/, (_, a, b, c) =>
      c ? `${a}-${b}-${c}` : `${a}-${b}`
    );
  };

  const rrnMask = (v) => {
    const d = onlyDigits(v).slice(0, 13);
    if (d.length <= 6) return d;
    return d.slice(0, 6) + "-" + d.slice(6);
  };

  // ---------- 입력 핸들러 ----------
  const handleLoginIdChange = (e) => {
    const filtered = e.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 20);
    setLoginId(filtered);
    setIdChecked(false);
  };

  const handlePhoneChange = (e) => {
    setPhone(phoneHyphen(e.target.value));
  };

  const handleRrnChange = (e) => {
    setRrn(rrnMask(e.target.value));
  };

  // ---------- 아이디 중복 확인 ----------
  const handleCheckId = async () => {
    const v = loginId.trim();
    if (!v) {
      alert("아이디를 입력하세요.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await checkLoginId(v);

      console.log("중복 확인 결과:", result);

      // 응답 구조: { isSuccess: true, code: "200", data: true/false }
      // data가 true면 사용 가능, false면 이미 사용 중
      if (result.isSuccess && result.data === true) {
        alert("사용 가능한 아이디입니다.");
        setIdChecked(true);
      } else {
        alert("이미 사용 중인 아이디입니다.");
        setIdChecked(false);
      }
    } catch (error) {
      console.error("중복 확인 에러:", error);
      alert(error.message);
      setIdChecked(false);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- 제출 검증 ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idChecked) {
      alert("아이디 중복확인을 해주세요.");
      return;
    }

    if (!password || password.length < 8) {
      alert("비밀번호는 8자 이상입니다.");
      return;
    }

    if (password !== password2) {
      alert("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (!name.trim()) {
      alert("이름을 입력하세요.");
      return;
    }

    if (!/^\d{6}-\d{7}$/.test(rrn.trim())) {
      alert("주민등록번호 형식을 확인하세요.");
      return;
    }

    if (!/^\d{3}-\d{3,4}-\d{4}$/.test(phone.trim())) {
      alert("휴대폰 번호 형식을 확인하세요.");
      return;
    }

    if (!address.trim()) {
      alert("주소를 입력하세요.");
      return;
    }

    setIsLoading(true);
    try {
      const userData = {
        loginId: loginId.trim(),
        password: password.trim(),
        name: name.trim(),
        rrn: rrn.trim(),
        gender,
        phone: phone.trim(),
        address: address.trim(),
        agreeMarketing,
      };

      const result = await signUp(userData);

      // 회원가입 성공 여부 확인
      if (result.isSuccess) {
        // alert 제거하고 완료 페이지로 이동
        navigate("/signup/done");
      } else {
        alert(result.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const headerProps = {
    // title: "회원가입",
  };

  return (
    <AppLayout headerProps={headerProps}>
      <div className="px-4 py-3">
        <h2 className="text-[20px] font-extrabold text-slate-900 tracking-[-0.02em] mt-1.5 mb-6 ml-0.5">
          회원가입
        </h2>

        <form
          id="signUpForm"
          onSubmit={handleSubmit}
          className="flex flex-col gap-[18px]"
          noValidate
        >
          {/* 아이디 + 중복확인 */}
          <div className="field">
            <label
              className="block text-[13px] font-bold text-slate-900 mb-2 ml-0.5"
              htmlFor="loginId"
            >
              아이디
            </label>
            <div className="flex gap-2">
              <input
                className="flex-1 h-12 bg-white border border-slate-200 rounded-xl px-3.5 text-base text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600"
                id="loginId"
                name="loginId"
                type="text"
                autoComplete="username"
                placeholder="아이디"
                maxLength={20}
                inputMode="latin"
                value={loginId}
                onChange={handleLoginIdChange}
                disabled={isLoading}
              />
              <button
                className="flex-none h-12 px-4 rounded-xl border border-blue-600 bg-white text-blue-600 font-bold text-sm active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
                onClick={handleCheckId}
                disabled={isLoading || !loginId.trim()}
              >
                중복 확인
              </button>
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="field">
            <label
              className="block text-[13px] font-bold text-slate-900 mb-2 ml-0.5"
              htmlFor="password"
            >
              비밀번호
            </label>
            <input
              className="w-full h-12 bg-white border border-slate-200 rounded-xl px-3.5 text-base text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600"
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <div className="text-[12px] text-slate-500 mt-1.5 leading-relaxed">
              사용 가능한 문자는 영문, 숫자, 특수문자이며, 8~16자 이내여야
              합니다.
            </div>
          </div>

          {/* 비밀번호 확인 */}
          <div className="field">
            <label
              className="block text-[13px] font-bold text-slate-900 mb-2 ml-0.5"
              htmlFor="password2"
            >
              비밀번호 확인
            </label>
            <input
              className="w-full h-12 bg-white border border-slate-200 rounded-xl px-3.5 text-base text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600"
              id="password2"
              type="password"
              autoComplete="new-password"
              placeholder="비밀번호 확인"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* 이름 */}
          <div className="field">
            <label
              className="block text-[13px] font-bold text-slate-900 mb-2 ml-0.5"
              htmlFor="name"
            >
              이름
            </label>
            <input
              className="w-full h-12 bg-white border border-slate-200 rounded-xl px-3.5 text-base text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600"
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* 주민등록번호 */}
          <div className="field">
            <label
              className="block text-[13px] font-bold text-slate-900 mb-2 ml-0.5"
              htmlFor="rrn"
            >
              주민등록번호
            </label>
            <input
              className="w-full h-12 bg-white border border-slate-200 rounded-xl px-3.5 text-base text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600"
              id="rrn"
              name="rrn"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="주민등록번호 (예: 901201-1234567)"
              value={rrn}
              onChange={handleRrnChange}
              disabled={isLoading}
            />
          </div>

          {/* 성별 (세그먼트 버튼) */}
          <div className="field">
            <label className="block text-[13px] font-bold text-slate-900 mb-2 ml-0.5">
              성별
            </label>
            <div className="flex gap-2" role="radiogroup" aria-label="성별">
              <label className="flex-1 h-11 border border-slate-200 rounded-xl bg-white flex items-center justify-center font-semibold text-slate-900 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="F"
                  checked={gender === "F"}
                  onChange={(e) => setGender(e.target.value)}
                  className="hidden"
                  disabled={isLoading}
                />
                <span
                  className={`flex-1 text-center rounded-xl py-2.5 ${
                    gender === "F"
                      ? "border-2 border-blue-600"
                      : "border-2 border-transparent"
                  }`}
                >
                  여자
                </span>
              </label>

              <label className="flex-1 h-11 border border-slate-200 rounded-xl bg-white flex items-center justify-center font-semibold text-slate-900 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="M"
                  checked={gender === "M"}
                  onChange={(e) => setGender(e.target.value)}
                  className="hidden"
                  disabled={isLoading}
                />
                <span
                  className={`flex-1 text-center rounded-xl py-2.5 ${
                    gender === "M"
                      ? "border-2 border-blue-600"
                      : "border-2 border-transparent"
                  }`}
                >
                  남자
                </span>
              </label>
            </div>
          </div>

          {/* 휴대폰 */}
          <div className="field">
            <label
              className="block text-[13px] font-bold text-slate-900 mb-2 ml-0.5"
              htmlFor="phone"
            >
              휴대폰 번호
            </label>
            <input
              className="w-full h-12 bg-white border border-slate-200 rounded-xl px-3.5 text-base text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600"
              id="phone"
              name="phone"
              type="text"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="휴대폰 번호"
              value={phone}
              onChange={handlePhoneChange}
              disabled={isLoading}
            />
          </div>

          {/* 주소 */}
          <div className="field">
            <label
              className="block text-[13px] font-bold text-slate-900 mb-2 ml-0.5"
              htmlFor="address"
            >
              주소
            </label>
            <input
              className="w-full h-12 bg-white border border-slate-200 rounded-xl px-3.5 text-base text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600"
              id="address"
              name="address"
              type="text"
              autoComplete="street-address"
              placeholder="주소"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* 제출 버튼 */}
          <div className="flex flex-col items-center px-6 pt-3 pb-5">
            <button
              className="w-full rounded-full bg-blue-600 text-white py-3 text-[14px] font-semibold shadow-sm active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "처리 중..." : "회원 가입"}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

export default SignUpPage;
