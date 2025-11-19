import React from "react";
import Modal from "./Modal";

/**
 * 예약/접수 확인 모달 컴포넌트
 *
 * @param {boolean} isOpen - 모달 표시 여부
 * @param {function} onClose - 모달 닫기 함수
 * @param {function} onConfirm - 확인 버튼 클릭 함수
 * @param {Object} data - 표시할 데이터
 * @param {string} data.departmentName - 진료과명
 * @param {string} data.doctorName - 의사명
 * @param {string} data.dateTime - 예약 일시 (포맷된 문자열)
 * @param {string} type - "reservation" | "reception"
 */
function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  data = {},
  type = "reservation",
}) {
  const { departmentName, doctorName, dateTime } = data;

  const title = type === "reservation" ? "예약 정보 확인" : "접수 정보 확인";
  const confirmText = type === "reservation" ? "예약 확정" : "접수 확정";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* 제목 */}
      <div className="mb-5 text-lg font-extrabold text-gray-900">{title}</div>

      {/* 정보 */}
      <div className="mb-4 space-y-3">
        <div className="flex justify-between border-b border-gray-100 py-3">
          <span className="text-sm text-gray-500">진료과</span>
          <span className="text-sm font-semibold text-gray-900">
            {departmentName}
          </span>
        </div>
        <div className="flex justify-between border-b border-gray-100 py-3">
          <span className="text-sm text-gray-500">의료진</span>
          <span className="text-sm font-semibold text-gray-900">
            {doctorName} 교수
          </span>
        </div>
        <div className="flex justify-between border-b border-gray-100 py-3">
          <span className="text-sm text-gray-500">
            {type === "reservation" ? "예약 일시" : "접수 일시"}
          </span>
          <span className="text-sm font-semibold text-gray-900">
            {dateTime}
          </span>
        </div>
      </div>

      {/* 안내사항 */}
      <div className="mb-5 rounded-xl bg-blue-50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-base text-blue-500">ℹ️</span>
          <span className="text-sm font-semibold text-blue-500">안내사항</span>
        </div>
        <div className="text-sm text-gray-600">도착 10분 전 내원해주세요</div>
      </div>

      {/* 버튼 */}
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="h-12 flex-1 rounded-xl bg-gray-100 font-bold text-gray-600 transition-colors hover:bg-gray-200"
        >
          취소
        </button>
        <button
          onClick={onConfirm}
          className="h-12 flex-1 rounded-xl bg-blue-500 font-bold text-white transition-colors hover:bg-blue-600"
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmationModal;
