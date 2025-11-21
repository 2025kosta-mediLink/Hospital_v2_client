/**
 * 공통 알림 모달
 * @param {boolean} isOpen - 모달 열림 상태
 * @param {function} onClose - 모달 닫기 함수
 * @param {string} title - 제목 (선택)
 * @param {string} message - 메시지 내용
 * @param {string} confirmText - 확인 버튼 텍스트 (기본: "확인")
 * @param {string} type - 모달 타입 ("info" | "success" | "warning" | "error")
 */
export default function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  confirmText = "확인",
  type = "info",
}) {
  if (!isOpen) return null;

  // 타입별 아이콘 설정
  const typeConfig = {
    info: {
      icon: (
        <svg
          className="w-8 h-8 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      iconBg: "bg-blue-100",
    },
    success: {
      icon: (
        <svg
          className="w-8 h-8 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      iconBg: "bg-blue-100",
    },
    warning: {
      icon: (
        <svg
          className="w-8 h-8 text-orange-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
      iconBg: "bg-orange-100",
    },
    error: {
      icon: (
        <svg
          className="w-8 h-8 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      iconBg: "bg-red-100",
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[340px] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 아이콘 */}
        <div className="flex justify-center mb-4">
          <div
            className={`w-16 h-16 rounded-full ${config.iconBg} flex items-center justify-center`}
          >
            {config.icon}
          </div>
        </div>

        {/* 제목 */}
        {title && (
          <h2 className="text-lg font-bold text-gray-900 text-center mb-2">
            {title}
          </h2>
        )}

        {/* 메시지 */}
        <p className="text-sm text-gray-600 text-center mb-6 whitespace-pre-line leading-relaxed">
          {message}
        </p>

        {/* 버튼 */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}
