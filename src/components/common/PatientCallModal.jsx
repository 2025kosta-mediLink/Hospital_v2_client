import { useEffect, useState } from "react";

export default function PatientCallModal({ isOpen, onClose, callData }) {
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(30);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !callData) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 컨텐츠 */}
      <div className="relative w-[90%] max-w-[340px] bg-white rounded-2xl shadow-2xl p-6 animate-scale-in">
        {/* 애니메이션 아이콘 */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
            <svg
              className="w-12 h-12 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
        </div>

        {/* 호출 메시지 */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">진료 호출</h2>
          <p className="text-gray-600 mb-4">
            {callData.doctorName || "담당 의사"} 의사가 호출하셨습니다
          </p>

          {/* 대기번호 강조 */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
            <div className="text-sm text-gray-600 mb-1">대기번호</div>
            <div className="text-5xl font-bold text-blue-600">
              {callData.queueNo || "-"}번
            </div>
          </div>

          {/* 진료실 정보 */}
          <div className="bg-gray-50 rounded-lg p-3 mb-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">진료과</span>
              <span className="font-semibold text-gray-900">
                {callData.departmentName || "진료과"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600">진료실</span>
              <span className="font-semibold text-gray-900">
                {callData.roomNumber || "진료실"}
              </span>
            </div>
          </div>

          {/* 안내 메시지 */}
          <p className="text-sm text-gray-500 mt-3">진료실로 이동해주세요</p>
        </div>

        {/* 카운트다운 */}
        <div className="mb-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
            <svg
              className="w-4 h-4 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-gray-600">
              {countdown}초 후 자동으로 닫힙니다
            </span>
          </div>
        </div>

        {/* 확인 버튼 */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all"
        >
          확인
        </button>
      </div>

      {/* CSS 애니메이션 */}
      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
