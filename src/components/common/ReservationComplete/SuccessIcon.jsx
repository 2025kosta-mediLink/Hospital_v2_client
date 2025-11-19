export default function SuccessIcon() {
  return (
    <div className="flex justify-center items-center py-3">
      <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    </div>
  );
}
