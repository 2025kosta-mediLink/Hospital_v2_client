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
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-900",
      buttonColor:
        "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    },
    success: {
      icon: (
        <svg
          className="w-8 h-8 text-green-600"
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
      gradient: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-900",
      buttonColor:
        "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
    },
    warning: {
      icon: (
        <svg
          className="w-8 h-8 text-yellow-600"
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
      gradient: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-900",
      buttonColor:
        "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700",
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
      gradient: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-900",
      buttonColor:
        "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      style={{ margin: 0, left: 0, right: 0 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-[340px] overflow-hidden flex flex-col shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 내용 */}
        <div className="p-6">
          {/* 아이콘 */}
          <div className="flex justify-center mb-4">
            <div
              className={`w-20 h-20 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}
            >
              <div className="w-18 h-18 rounded-full bg-white flex items-center justify-center">
                {config.icon}
              </div>
            </div>
          </div>

          {/* 제목 */}
          {title && (
            <h2 className="text-xl font-bold text-gray-900 text-center mb-3">
              {title}
            </h2>
          )}

          {/* 메시지 */}
          <div className="mb-5">
            <p className="text-[15px] text-gray-700 text-center leading-relaxed whitespace-pre-wrap">
              {message}
            </p>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className={`w-full py-3.5 text-white text-[15px] font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] ${config.buttonColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
