import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import AlertModal from "../../components/common/AlertModal";

function ConsentPage() {
  const navigate = useNavigate();

  // 체크박스 상태
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [agreeService, setAgreeService] = useState(false);
  const [agreeTele, setAgreeTele] = useState(false);

  // 알림 모달 상태
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "warning",
  });

  // 전체 동의 클릭 시 모든 항목 일괄 처리
  const handleAgreeAllChange = (e) => {
    const checked = e.target.checked;
    setAgreeAll(checked);
    setAgreePrivacy(checked);
    setAgreeMarketing(checked);
    setAgreeService(checked);
    setAgreeTele(checked);
  };

  // 개별 항목 변경 시 전체 동의 상태 동기화
  useEffect(() => {
    if (agreePrivacy && agreeMarketing && agreeService && agreeTele) {
      setAgreeAll(true);
    } else {
      setAgreeAll(false);
    }
  }, [agreePrivacy, agreeMarketing, agreeService, agreeTele]);

  // 확인 버튼 클릭
  const handleConfirm = () => {
    // 필수 항목 체크
    if (!agreePrivacy || !agreeService || !agreeTele) {
      setAlertModal({
        isOpen: true,
        title: "필수 약관 동의",
        message: "필수 약관에 모두 동의해 주세요.",
        type: "warning",
      });
      return;
    }

    // 회원가입 페이지로 이동 (마케팅 동의 여부를 state로 전달)
    navigate("/signup", {
      state: {
        agreeMarketing,
      },
    });
  };

  const headerProps = {
    title: "", // 빈 문자열로 타이틀 숨김
  };

  return (
    <>
      <AppLayout headerProps={headerProps}>
        <div className="flex flex-col gap-3 mt-3 mx-4 mb-[calc(var(--navbar-h,64px)+env(safe-area-inset-bottom)+12px)]">
          {/* 페이지 타이틀 */}
          <h2 className="text-[20px] font-extrabold text-slate-900 tracking-[-0.02em] mt-1.5 mb-3 ml-0.5">
            회원가입 약관 동의
          </h2>

          {/* 전체 동의 */}
          <label className="flex items-center gap-2.5 px-4 py-3.5 bg-blue-50 border border-slate-200 rounded-xl cursor-pointer">
            <CheckboxInput
              id="agreeAll"
              checked={agreeAll}
              onChange={handleAgreeAllChange}
            />
            <strong className="text-[15px] font-bold text-slate-900">
              전체동의
            </strong>
          </label>

          {/* 개인정보 처리방침 섹션 */}
          <section className="bg-white border border-slate-200 rounded-xl px-4 py-3.5 flex flex-col gap-2.5">
            <div className="flex items-center justify-start pb-1.5 border-b border-slate-200">
              <div className="font-bold text-slate-900 text-[14px]">
                개인정보 처리방침 동의
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <CheckboxInput
                id="agreePrivacy"
                checked={agreePrivacy}
                onChange={(e) => setAgreePrivacy(e.target.checked)}
              />
              <span className="text-[14px] text-slate-900 leading-relaxed">
                (필수) 개인정보 처리방침 동의
                <br />
                <small className="text-[12px] text-slate-500 mt-1 block">
                  개인정보 수집·이용 목적/기간, 제3자 제공, 처리 위탁
                </small>
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <CheckboxInput
                id="agreeMarketing"
                checked={agreeMarketing}
                onChange={(e) => setAgreeMarketing(e.target.checked)}
              />
              <span className="text-[14px] text-slate-900 leading-relaxed">
                (선택) 진료/예약 알림 및 마케팅 정보 수신
                <br />
                <small className="text-[12px] text-slate-500 mt-1 block">
                  문자·알림 수신 동의, 언제든 해제 가능
                </small>
              </span>
            </label>
          </section>

          {/* 서비스 이용 약관 섹션 */}
          <section className="bg-white border border-slate-200 rounded-xl px-4 py-3.5 flex flex-col gap-2.5">
            <div className="flex items-center justify-start pb-1.5 border-b border-slate-200">
              <div className="font-bold text-slate-900 text-[14px]">
                서비스 이용 약관 동의
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <CheckboxInput
                id="agreeService"
                checked={agreeService}
                onChange={(e) => setAgreeService(e.target.checked)}
              />
              <span className="text-[14px] text-slate-900 leading-relaxed">
                (필수) 서비스 이용 약관 동의
                <br />
                <small className="text-[12px] text-slate-500 mt-1 block">
                  회원가입, 이용자 의무, 서비스 제한, 분쟁 해결
                </small>
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <CheckboxInput
                id="agreeTele"
                checked={agreeTele}
                onChange={(e) => setAgreeTele(e.target.checked)}
              />
              <span className="text-[14px] text-slate-900 leading-relaxed">
                (필수) 비대면진료·처방 및 본인확인 동의
                <br />
                <small className="text-[12px] text-slate-500 mt-1 block">
                  진료 녹취/기록 처리, 본인확인, 전자처방전 전송
                </small>
              </span>
            </label>
          </section>

          {/* 확인 버튼 */}
          <div className="flex flex-col items-center px-6 pt-3.75 pb-5 h-[85px]">
            <button
              onClick={handleConfirm}
              className="w-full rounded-full bg-blue-600 text-white py-3 text-[14px] font-semibold shadow-sm active:scale-[0.99] transition"
            >
              확인
            </button>
          </div>
        </div>
      </AppLayout>

      {/* 알림 모달 */}
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

// 재사용 가능한 체크박스 컴포넌트
function CheckboxInput({ id, checked, onChange }) {
  return (
    <span className="relative w-5 h-5 flex-shrink-0">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
      <i
        className={`absolute inset-0 rounded border-[1.5px] transition-all duration-150 ${
          checked ? "bg-blue-600 border-blue-600" : "bg-white border-slate-300"
        }`}
      />
      <svg
        viewBox="0 0 14 14"
        className={`absolute left-1/2 top-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 stroke-white stroke-[3] fill-none transition-opacity duration-150 ${
          checked ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        <path d="M3 7l3 3 5-6" />
      </svg>
    </span>
  );
}

export default ConsentPage;
