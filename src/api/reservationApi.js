import apiClient from "./client";

/**
 * 예약 가능 시간 슬롯 조회
 * GET /api/v2/reservation/doctor/:doctorId/available-times?date=YYYY-MM-DD
 */
export const getAvailableTimeSlots = async (doctorId, date) => {
  try {
    const response = await apiClient.get(
      `/reservation/doctor/${doctorId}/available-times`,
      {
        params: { date },
      }
    );
    // console.log("[API] getAvailableTimeSlots 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("[API] getAvailableTimeSlots 에러:", error);

    // 400 에러 (휴진일, 스케줄 없음 등) - 빈 배열 반환
    if (error.response?.status === 400) {
      console.log("[API] 해당 날짜에 예약 가능한 시간이 없습니다.");
      return {
        isSuccess: true,
        code: "200",
        data: {
          am: [],
          pm: [],
        },
      };
    }

    // 그 외 에러는 throw
    throw new Error("예약 가능 시간을 불러오는데 실패했습니다.");
  }
};

/**
 * 예약 생성
 * POST /api/v2/reservation/create
 *
 * @param {Object} reservationData - 예약 데이터
 * @param {number} reservationData.doctorId - 의사 ID
 * @param {string} reservationData.appointmentAt - 예약 일시 (YYYY-MM-DD HH:MM:SS)
 * @returns {Promise<ApiResponse>}
 */
export const createReservation = async (reservationData) => {
  try {
    // ✅ appointmentAt → reservationTime으로 변환
    // "2025-11-22 09:30:00" → "2025-11-22T09:30:00"
    const requestBody = {
      doctorId: reservationData.doctorId,
      reservationTime: reservationData.appointmentAt.replace(" ", "T"),
    };

    console.log("[API] createReservation 요청:", requestBody); // 디버깅용

    const response = await apiClient.post("/reservation", requestBody);
    console.log("[API] createReservation 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("[API] createReservation 에러:", error);
    console.error("[API] 에러 응답:", error.response?.data); // 디버깅용

    // 409 Conflict - 이미 예약된 시간
    if (error.response?.status === 409) {
      throw new Error(
        "해당 시간은 이미 예약되었습니다. 다른 시간을 선택해주세요."
      );
    }

    // 400 Bad Request - 유효성 검증 실패
    if (error.response?.status === 400) {
      throw new Error(
        error.response.data.message || "예약 정보를 확인해주세요."
      );
    }

    throw new Error("예약에 실패했습니다. 다시 시도해주세요.");
  }
};

/**
 * 예약 목록 조회
 * GET /api/v2/reservation/list
 *
 * @param {Object} params - 조회 조건
 * @param {string} params.status - 예약 상태 ("upcoming" | "completed" | "cancelled")
 * @param {number} params.page - 페이지 번호 (기본: 1)
 * @param {number} params.size - 페이지 크기 (기본: 10)
 * @returns {Promise<ApiResponse>}
 */
export const getReservationList = async ({
  status,
  page = 1,
  size = 10,
} = {}) => {
  try {
    const response = await apiClient.get("/reservation/list", {
      params: { status, page, size },
    });
    // console.log("[API] getReservationList 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("[API] getReservationList 에러:", error);
    throw new Error("예약 목록을 불러오는데 실패했습니다.");
  }
};

/**
 * 예약 취소
 * @param {number} reservationId - 예약 ID
 */
export const cancelReservation = async (reservationId) => {
  const response = await apiClient.post(`/reservation/${reservationId}/cancel`);
  return response.data;
};

/**
 * 예약 상세 조회
 * GET /api/v2/reservation/:reservationId
 *
 * @param {number} reservationId - 예약 ID
 * @returns {Promise<ApiResponse>}
 */
export const getReservationDetail = async (reservationId) => {
  try {
    const response = await apiClient.get(`/reservation/${reservationId}`);
    // console.log(
    //   `[API] getReservationDetail(${reservationId}) 응답:`,
    //   response.data
    // );
    return response.data;
  } catch (error) {
    console.error(`[API] getReservationDetail(${reservationId}) 에러:`, error);

    if (error.response?.status === 404) {
      throw new Error("예약 정보를 찾을 수 없습니다.");
    }

    throw new Error("예약 정보를 불러오는데 실패했습니다.");
  }
};

/**
 * 오늘의 예약 목록 조회
 * GET /api/v2/reservation/today
 */
export const getTodayReservations = async () => {
  try {
    const response = await apiClient.get("/reservation/today");
    return response.data;
  } catch (error) {
    console.error("getTodayReservations error:", error);
    throw new Error(
      error.response?.data?.message ||
        "오늘의 예약 조회 중 오류가 발생했습니다."
    );
  }
};
