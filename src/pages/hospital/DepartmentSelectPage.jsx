import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/layout/Header";
import BottomNav from "../../components/layout/BottomNav";
import { getDepartmentList } from "../../api/departmentApi";

function DepartmentSelectPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { from } = location.state || {};

  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDeptId, setSelectedDeptId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // API 호출
  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const result = await getDepartmentList();

        if (result.isSuccess && result.data) {
          setDepartments(result.data);
          setFilteredDepartments(result.data);
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // 검색
  const handleSearch = (value) => {
    setSearchTerm(value);

    if (!value.trim()) {
      setFilteredDepartments(departments);
    } else {
      const filtered = departments.filter((dept) =>
        dept.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDepartments(filtered);
    }
  };

  // 진료과 선택
  const handleSelectDepartment = (deptId) => {
    setSelectedDeptId(deptId);
  };

  // 다음 버튼
  const handleNext = () => {
    if (!selectedDeptId) {
      alert("진료과를 선택해주세요.");
      return;
    }

    const selectedDept = departments.find(
      (d) => d.departmentId === selectedDeptId
    );

    // from 값에 따라 경로 분기
    const nextPath =
      from === "reservation" ? "/reservation/doctors" : "/reception/doctors";

    // 의료진 선택 페이지로 이동
    navigate(nextPath, {
      state: {
        from,
        departmentId: selectedDeptId,
        departmentName: selectedDept?.name,
      },
    });
  };

  // 진료과명에서 첫 글자 추출
  const getFirstChar = (name) => {
    return name ? name.charAt(0) : "";
  };

  const headerProps = {
    // title: "진료과 선택",
    showBack: true,
    onBack: () => navigate(-1),
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="relative flex min-h-screen w-full max-w-[393px] flex-col bg-white">
        {/* 헤더 - 고정 */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] z-50">
          <Header {...headerProps} />
        </div>

        {/* 검색바 - 고정 (헤더 아래) */}
        <div className="fixed top-14 left-1/2 -translate-x-1/2 w-full max-w-[393px] px-4 pt-3 pb-4 bg-white border-b border-slate-200 z-40">
          <div className="relative">
            <input
              type="text"
              placeholder="진료과명을 입력하세요"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full h-12 bg-white border-2 border-slate-300 rounded-xl pl-4 pr-20 text-base text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600"
            />
            <button
              type="button"
              onClick={() => handleSearch(searchTerm)}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg active:scale-95 transition"
            >
              검색
            </button>
          </div>
        </div>

        {/* 스크롤 영역 - 진료과 목록만 스크롤 (상단 여백: 헤더 + 검색바) */}
        <div className="flex-1 overflow-y-auto px-4 py-4 bg-slate-50 mt-[120px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-slate-500">로딩 중...</p>
            </div>
          ) : filteredDepartments.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-slate-500">검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pb-40">
              {filteredDepartments.map((dept) => (
                <label
                  key={dept.departmentId}
                  className="relative block cursor-pointer"
                >
                  <input
                    type="radio"
                    name="department"
                    value={dept.departmentId}
                    checked={selectedDeptId === dept.departmentId}
                    onChange={() => handleSelectDepartment(dept.departmentId)}
                    className="sr-only"
                  />
                  <div
                    className={`h-32 rounded-2xl border bg-white flex flex-col items-center justify-center gap-3 transition shadow-sm ${
                      selectedDeptId === dept.departmentId
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-100"
                    }`}
                  >
                    {/* 원형 배경 + 첫 글자 */}
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xl font-bold text-blue-600">
                        {getFirstChar(dept.name)}
                      </span>
                    </div>
                    {/* 진료과명 */}
                    <span className="text-[13px] font-bold text-slate-900">
                      {dept.name}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 하단 고정 버튼 - BottomNav 위에 fixed */}
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[393px] bg-white border-t border-slate-200 p-4 z-40">
          <button
            onClick={handleNext}
            disabled={!selectedDeptId}
            className="w-full rounded-xl bg-blue-500 text-white py-4 text-base font-bold shadow-sm active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음
          </button>
        </div>

        {/* 하단 네비게이션 - 고정 */}
        <BottomNav />
      </div>
    </div>
  );
}

export default DepartmentSelectPage;
