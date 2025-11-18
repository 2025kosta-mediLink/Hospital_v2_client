/**
 * 안내사항 박스
 */
export default function NoticeBox({ notices = [] }) {
  return (
    <div className="w-full p-4 bg-blue-50 rounded-xl flex flex-col gap-2">
      {/* 제목 */}
      <div className="flex items-center gap-2 text-[13px] font-semibold text-blue-600 mb-1">
        <span className="text-[17px]">ℹ️</span>
        <span>진료 안내사항</span>
      </div>

      {/* 안내 내용 */}
      <div className="flex flex-col gap-1">
        {notices.map((notice, index) => (
          <div key={index} className="text-xs leading-[17px] text-gray-600">
            &nbsp;•&nbsp;{notice}
          </div>
        ))}
      </div>
    </div>
  );
}
