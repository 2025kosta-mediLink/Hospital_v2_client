/**
 * 빈 상태 화면
 */
export default function EmptyState({ type = "reservation" }) {
  const message =
    type === "reservation"
      ? "표시할 예약 내역이 없습니다."
      : "표시할 접수 내역이 없습니다.";

  return (
    <div className="mx-4 my-6 px-4.5 py-4.5 border border-dashed border-gray-300 rounded-xl text-center text-gray-500 text-sm">
      {message}
    </div>
  );
}
