import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import BottomNav from "../../components/layout/BottomNav";
import FilterTabs from "../../components/common/HistoryList/FilterTabs";
import HistoryList from "../../components/common/HistoryList";
import {
  getReservationList,
  cancelReservation,
} from "../../api/reservationApi";
import { shareToKakao } from "../../utils/kakaoSdk";

export default function ReservationListPage() {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [monthOptions, setMonthOptions] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // ✅ 추가

  // 날짜/시간 파싱 함수
  const parseDateTime = (appointmentAt) => {
    if (!appointmentAt) return { date: "", time: "", yearMonth: "" };

    // "2025-11-29T15:30:00" → { date: "2025-11-29", time: "15:30", yearMonth: "2025-11" }
    const [datePart, timePart] = appointmentAt.split("T");
    const yearMonth = datePart.substring(0, 7); // "2025-11"
    const time = timePart.substring(0, 5); // "15:30"

    return {
      date: datePart,
      time: time,
      yearMonth: yearMonth,
    };
  };

  // 날짜 라벨 생성 (2025년 11월 29일 (금))
  const formatDateLabel = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return `${year}년 ${month}월 ${day}일 (${weekday})`;
  };

  // 데이터 변환 함수
  const transformReservationData = (items) => {
    return items.map((item) => {
      const { date, time, yearMonth } = parseDateTime(item.appointmentAt);

      return {
        ...item,
        appointmentDate: date,
        appointmentTime: time,
        dateLabel: formatDateLabel(date),
        timeLabel: time,
        yearMonth: yearMonth,
      };
    });
  };

  // 데이터 로드
  const loadData = async (month, status) => {
    setIsLoading(true);
    try {
      const params = {};

      // 월 필터 (YYYY-MM → year, month)
      if (month && month !== "ALL") {
        const [year, monthNum] = month.split("-");
        params.year = parseInt(year, 10);
        params.month = parseInt(monthNum, 10);
      }

      // 상태 필터
      if (status && status !== "ALL") {
        params.status = status;
      }

      const result = await getReservationList(params);

      if (result.isSuccess) {
        const rawItems = result.data || [];

        // 1️⃣ 데이터 변환 (appointmentAt → appointmentDate, appointmentTime, yearMonth)
        const transformedItems = transformReservationData(rawItems);

        // 2️⃣ 월 옵션 생성 (첫 로드 시)
        if (monthOptions.length === 0) {
          const months = new Set();
          transformedItems.forEach((item) => {
            if (item.yearMonth) {
              months.add(item.yearMonth);
            }
          });

          const opts = Array.from(months)
            .sort()
            .reverse()
            .map((ym) => {
              const [y, m] = ym.split("-");
              return {
                value: ym,
                label: `${y}년 ${parseInt(m, 10)}월`,
              };
            });

          setMonthOptions(opts);
        }

        // 3️⃣ 월별 그룹핑
        const grouped = {};
        transformedItems.forEach((item) => {
          const ym = item.yearMonth || "기타";
          if (!grouped[ym]) grouped[ym] = [];
          grouped[ym].push(item);
        });

        // 4️⃣ 각 그룹 내에서 날짜 내림차순 정렬
        Object.keys(grouped).forEach((key) => {
          grouped[key].sort((a, b) => {
            return new Date(b.appointmentDate) - new Date(a.appointmentDate);
          });
        });

        // console.log("✅ 변환된 데이터:", transformedItems);
        // console.log("✅ 그룹핑된 데이터:", grouped);

        setGroupedData(grouped);
      }
    } catch (error) {
      console.error("예약 목록 로드 에러:", error);
      alert(error.message || "목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedMonth, selectedStatus);
  }, [selectedMonth, selectedStatus]);

  // 필터 변경
  const handleFilterChange = ({ month, status }) => {
    setSelectedMonth(month || "ALL");
    setSelectedStatus(status || "ALL");
  };

  // 예약 취소
  const handleCancel = async (item) => {
    // ✅ item 객체 전체를 받도록 수정
    if (!confirm("예약을 취소하시겠습니까?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await cancelReservation(item.reservationId); // ✅ item.reservationId 사용

      if (result.isSuccess) {
        alert("예약이 취소되었습니다.");
        // 목록 새로고침
        await loadData(selectedMonth, selectedStatus);
      } else {
        alert(result.message || "예약 취소에 실패했습니다.");
      }
    } catch (error) {
      console.error("예약 취소 실패:", error);
      alert(error.response?.data?.message || "예약 취소에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  // 카카오톡 공유
  const handleShare = (item) => {
    const shareUrl = window.location.href;

    shareToKakao({
      title: "MediLink 병원 예약 일정 안내",
      description: `📍 ${item.departmentName} - ${item.doctorName} 교수\n📅 ${item.dateLabel}\n⏰ ${item.timeLabel}`,
      imageUrl: "https://your-image-url.com/hospital-logo.png", // ✅ 여기에 실제 이미지 URL
      linkUrl: shareUrl,
    });
  };

  return (
    <div className="flex flex-col min-h-screen max-w-[393px] mx-auto bg-white">
      <Header showBack={true} />

      {/* 탭 네비게이션 (예약/접수) */}
      <nav className="grid grid-cols-2 h-12 border-b border-gray-200 bg-white">
        <button className="relative flex items-center justify-center text-sm font-semibold text-blue-600 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-8 after:h-0.5 after:bg-blue-600 after:rounded-full">
          예약내역
        </button>
        <button
          onClick={() => navigate("/reception/list")}
          className="flex items-center justify-center text-sm font-semibold text-gray-500"
        >
          접수내역
        </button>
      </nav>

      {/* 필터 */}
      <FilterTabs
        type="reservation"
        selectedMonth={selectedMonth}
        selectedStatus={selectedStatus}
        monthOptions={monthOptions}
        onFilterChange={handleFilterChange}
      />

      {/* 리스트 */}
      <main className="flex-1 overflow-y-auto bg-gray-50 pb-20">
        {isLoading || isDeleting ? (
          <div className="flex items-center justify-center py-12 text-gray-500">
            {isDeleting ? "취소 중..." : "로딩중..."}
          </div>
        ) : (
          <HistoryList
            type="reservation"
            groupedData={groupedData}
            onCancel={handleCancel}
            onShare={handleShare}
          />
        )}
      </main>

      <BottomNav />
    </div>
  );
}
