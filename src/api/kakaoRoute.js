import axios from "axios";

export const kakaoRouteApi = {
  getRoute: (params) =>
    axios.post("/api/kakao/route", params).then((res) => res.data),
};
