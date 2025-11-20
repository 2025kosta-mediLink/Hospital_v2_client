import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import BottomNav from "../../components/layout/BottomNav";
import FilterTabs from "../../components/common/HistoryList/FilterTabs";
import HistoryList from "../../components/common/HistoryList";
import CancelConfirmModal from "../../components/common/CancelConfirmModal";
import {
  getReservationList,
  cancelReservation,
} from "../../api/reservationApi";
import { shareToKakao } from "../../utils/kakaoSdk";
import {
  parseDateTime,
  formatDateLabel,
  formatTimeLabel,
  generateMonthOptions,
  groupByMonth,
} from "../../utils/dateUtils";

export default function ReservationListPage() {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [monthOptions, setMonthOptions] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // 데이터 변환 함수
  const transformReservationData = (items) => {
    return items.map((item) => {
      const { date, time, yearMonth } = parseDateTime(item.appointmentAt);

      return {
        ...item,
        appointmentDate: date,
        appointmentTime: time,
        dateLabel: formatDateLabel(date),
        timeLabel: formatTimeLabel(time),
        yearMonth: yearMonth,
      };
    });
  };

  // 데이터 로드
  const loadData = async (month, status) => {
    setIsLoading(true);
    try {
      const params = {};

      if (month && month !== "ALL") {
        const [year, monthNum] = month.split("-");
        params.year = parseInt(year, 10);
        params.month = parseInt(monthNum, 10);
      }

      if (status && status !== "ALL") {
        params.status = status;
      }

      const result = await getReservationList(params);

      if (result.isSuccess) {
        const rawItems = result.data || [];
        const transformedItems = transformReservationData(rawItems);

        // 월 옵션 생성
        if (monthOptions.length === 0 && transformedItems.length > 0) {
          const months = new Set(
            transformedItems.map((item) => item.yearMonth).filter(Boolean)
          );
          setMonthOptions(generateMonthOptions(Array.from(months)));
        }

        // 월별 그룹핑 및 정렬
        const grouped = groupByMonth(
          transformedItems,
          "appointmentDate",
          "appointmentTime"
        );

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

  // 예약 취소 모달 열기
  const handleCancel = (item) => {
    setSelectedItem(item);
    setIsCancelModalOpen(true);
  };

  // 예약 취소 확인
  const handleConfirmCancel = async () => {
    if (!selectedItem) return;

    setIsCancelModalOpen(false);
    setIsDeleting(true);

    try {
      const result = await cancelReservation(selectedItem.reservationId);

      if (result.isSuccess) {
        alert("예약이 취소되었습니다.");
        await loadData(selectedMonth, selectedStatus);
      } else {
        alert(result.message || "예약 취소에 실패했습니다.");
      }
    } catch (error) {
      console.error("예약 취소 실패:", error);
      alert(error.response?.data?.message || "예약 취소에 실패했습니다.");
    } finally {
      setIsDeleting(false);
      setSelectedItem(null);
    }
  };

  // 카카오톡 공유
  const handleShare = (item) => {
    const shareUrl = window.location.href;

    shareToKakao({
      title: "MediLink 병원 예약 일정 안내",
      description: `📍 ${item.departmentName} - ${item.doctorName} 교수\n📅 ${item.dateLabel}\n⏰ ${item.timeLabel}`,
      imageUrl: "https://your-image-url.com/hospital-logo.png",
      linkUrl: shareUrl,
    });
  };

  return (
    <>
      <div className="flex flex-col h-screen max-w-[393px] mx-auto bg-white">
        <Header showBack={true} />

        {/* 탭 네비게이션 (예약/접수) - 고정 */}
        <nav className="sticky top-0 z-10 grid grid-cols-2 h-12 border-b border-gray-200 bg-white">
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

        {/* 필터 - 고정 */}
        <div className="sticky top-12 z-10 bg-white">
          <FilterTabs
            type="reservation"
            selectedMonth={selectedMonth}
            selectedStatus={selectedStatus}
            monthOptions={monthOptions}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* 리스트 - 스크롤 영역 */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
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
          {/* 하단 여백 (BottomNav 겹침 방지) */}
          <div className="h-20" />
        </main>

        <BottomNav />
      </div>

      <CancelConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        type="reservation"
        data={selectedItem}
      />
    </>
  );
}
