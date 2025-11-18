import React from "react";

/**
 * 범용 모달 컴포넌트
 *
 * @param {boolean} isOpen - 모달 표시 여부
 * @param {function} onClose - 모달 닫기 함수
 * @param {ReactNode} children - 모달 내용
 * @param {string} className - 추가 클래스명
 * @param {boolean} closeOnBackdropClick - 배경 클릭 시 닫기 (기본: true)
 */
function Modal({
  isOpen,
  onClose,
  children,
  className = "",
  closeOnBackdropClick = true,
}) {
  if (!isOpen) return null;

  const handleBackdropClick = () => {
    if (closeOnBackdropClick && onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* 백드롭 */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* 모달 카드 */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-[360px] mx-4 p-6 z-[61] ${className}`}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;
