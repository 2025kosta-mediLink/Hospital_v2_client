import apiClient from "./client";

/**
 * 접수 생성 (Direct)
 * POST /api/v2/receptions
 *
 * @param {Object} receptionData
 * @param {number} receptionData.doctorId - 의사 ID
 * @param {number[]} receptionData.symptomIds - 증상 ID 배열
 * @param {string} receptionData.noteToDoctor - 의사에게 전할 말 (선택)
 * @param {boolean} receptionData.consentNotice - 개인정보 동의 여부
 * @returns {Promise<ApiResponse>}
 */
export const createReception = async (receptionData) => {
  try {
    const response = await apiClient.post("/receptions", receptionData);
    console.log("[API] createReception 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("[API] createReception 에러:", error);

    if (error.response?.status === 409) {
      throw new Error("이미 접수된 정보입니다. 확인 후 다시 시도해주세요.");
    }

    if (error.response?.status === 400) {
      throw new Error(
        error.response.data.message || "접수 정보를 확인해주세요."
      );
    }

    throw new Error("접수에 실패했습니다. 다시 시도해주세요.");
  }
};

/**
 * 예약 기반 접수 생성
 * POST /api/v2/receptions/from-reservation
 *
 * @param {Object} receptionData
 * @param {number} receptionData.reservationId - 예약 ID
 * @param {number[]} receptionData.symptomIds - 증상 ID 배열
 * @param {string} receptionData.noteToDoctor - 의사에게 전할 말 (선택)
 * @param {boolean} receptionData.consentNotice - 개인정보 동의 여부
 * @returns {Promise<ApiResponse>}
 */
export const createReceptionFromReservation = async (receptionData) => {
  try {
    const response = await apiClient.post(
      "/receptions/from-reservation",
      receptionData
    );
    console.log("[API] createReceptionFromReservation 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("[API] createReceptionFromReservation 에러:", error);

    if (error.response?.status === 404) {
      throw new Error("예약 정보를 찾을 수 없습니다.");
    }

    if (error.response?.status === 400) {
      throw new Error(
        error.response.data.message || "예약 기반 접수에 실패했습니다."
      );
    }

    throw new Error("접수에 실패했습니다. 다시 시도해주세요.");
  }
};

/**
 * 접수 상세 조회
 * GET /api/v2/receptions/:receptionId
 *
 * @param {number} receptionId - 접수 ID
 * @returns {Promise<ApiResponse>}
 */
export const getReceptionDetail = async (receptionId) => {
  try {
    const response = await apiClient.get(`/receptions/${receptionId}`);
    console.log(
      `[API] getReceptionDetail(${receptionId}) 응답:`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(`[API] getReceptionDetail(${receptionId}) 에러:`, error);

    if (error.response?.status === 404) {
      throw new Error("접수 정보를 찾을 수 없습니다.");
    }

    throw new Error("접수 정보를 불러오는데 실패했습니다.");
  }
};

/**
 * 접수 목록 조회
 * GET /api/v2/receptions/list
 *
 * @param {Object} params - 조회 조건
 * @param {number} params.year - 연도
 * @param {number} params.month - 월
 * @param {string} params.status - 접수 상태 ("WAITING" | "COMPLETED" | "CANCELLED")
 * @returns {Promise<ApiResponse>}
 */
export const getReceptionList = async ({ year, month, status } = {}) => {
  try {
    const params = {};
    if (year) params.year = year;
    if (month) params.month = month;
    if (status && status !== "ALL") params.status = status;

    const response = await apiClient.get("/receptions/list", { params });
    console.log("[API] getReceptionList 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("[API] getReceptionList 에러:", error);

    // 400 에러 시 빈 배열 반환 (임시 처리)
    if (error.response?.status === 400) {
      return { isSuccess: true, data: [] };
    }

    throw new Error("접수 목록을 불러오는데 실패했습니다.");
  }
};

/**
 * 접수 취소
 * POST /api/v2/receptions/:receptionId/cancel
 *
 * @param {number} receptionId - 접수 ID
 * @param {string} reason - 취소 사유
 * @returns {Promise<ApiResponse>}
 */
export const cancelReception = async (receptionId, reason = "") => {
  try {
    const response = await apiClient.post(`/receptions/${receptionId}/cancel`, {
      reason: reason || "사용자 취소",
    });
    console.log(`[API] cancelReception(${receptionId}) 응답:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[API] cancelReception(${receptionId}) 에러:`, error);

    if (error.response?.status === 404) {
      throw new Error("접수 정보를 찾을 수 없습니다.");
    }

    if (error.response?.status === 400) {
      throw new Error(
        error.response.data.message || "취소할 수 없는 접수입니다."
      );
    }

    throw error;
  }
};
