import "./App.css";
import React from "react";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          Vite + Tailwind 세팅 완료 🎉
        </h1>
        <p className="text-slate-600">
          이제 여기부터 병원 예약/접수 시스템 화면을 컴포넌트로 쌓아가면 됩니다.
        </p>
      </div>
    </div>
  );
}

export default App;
