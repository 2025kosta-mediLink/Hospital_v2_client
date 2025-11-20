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

  // 타입별 아이콘 및 색상 설정
  const typeConfig = {
    info: {
      icon: (
        <svg
          className="w-6 h-6 text-blue-600"
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
      messageBg: "bg-blue-50",
      messageText: "text-blue-800",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    success: {
      icon: (
        <svg
          className="w-6 h-6 text-green-600"
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
      iconBg: "bg-green-100",
      messageBg: "bg-green-50",
      messageText: "text-green-800",
      buttonColor: "bg-green-600 hover:bg-green-700",
    },
    warning: {
      icon: (
        <svg
          className="w-6 h-6 text-yellow-600"
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
      iconBg: "bg-yellow-100",
      messageBg: "bg-yellow-50",
      messageText: "text-yellow-800",
      buttonColor: "bg-yellow-600 hover:bg-yellow-700",
    },
    error: {
      icon: (
        <svg
          className="w-6 h-6 text-red-600"
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
      messageBg: "bg-red-50",
      messageText: "text-red-800",
      buttonColor: "bg-red-500 hover:bg-red-600",
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-600/20 px-4"
      style={{ margin: 0, left: 0, right: 0 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[340px] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        {title && (
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <h2 className="text-base font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* 내용 */}
        <div className="p-4 space-y-3">
          {/* 메시지 박스 */}
          <div
            className={`${config.messageBg} rounded-xl p-3 flex items-center gap-3`}
          >
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full ${config.iconBg} flex items-center justify-center`}
            >
              {config.icon}
            </div>
            <p className={`text-sm ${config.messageText} flex-1`}>{message}</p>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="bg-white border-t border-gray-200 p-3 flex-shrink-0">
          <button
            onClick={onClose}
            className={`w-full py-2.5 text-white text-sm font-semibold rounded-xl transition-colors ${config.buttonColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
