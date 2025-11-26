/**
 * 카카오 SDK 초기화
 */
export const initKakaoSdk = () => {
  // 이미 초기화되어 있으면 스킵
  if (window.Kakao?.isInitialized()) {
    console.log("✅ 카카오 SDK 이미 초기화됨");
    return;
  }

  const script = document.createElement("script");
  script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.6/kakao.min.js";
  script.integrity =
    "sha384-WAtVcQYcmTO/N+C1N+1m6Gp8qxh+3NlnP7X1U7qP6P5dQY/MsRBNTh+e1ahJrkEm";
  script.crossOrigin = "anonymous";
  script.async = true;

  script.onload = () => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      const kakaoKey = import.meta.env.VITE_KAKAO_JS_KEY;

      // 디버깅: 키 확인
      // console.log(
      //   "🔑 카카오 키:",
      //   kakaoKey ? `${kakaoKey.substring(0, 10)}...` : "없음"
      // );
      // console.log("🌐 현재 도메인:", window.location.origin);

      if (kakaoKey) {
        try {
          window.Kakao.init(kakaoKey);
          // console.log("✅ 카카오 SDK 초기화 완료");
          // console.log("✅ 초기화 상태:", window.Kakao.isInitialized());
        } catch (error) {
          console.error("❌ 카카오 SDK 초기화 에러:", error);
        }
      } else {
        // 카카오 공유 기능을 사용하지 않는 경우 경고 제거
        // console.warn("⚠️ VITE_KAKAO_JS_KEY가 .env 파일에 설정되지 않았습니다.");
      }
    }
  };

  script.onerror = () => {
    console.error("❌ 카카오 SDK 로드 실패");
  };

  document.head.appendChild(script);
};

/**
 * 카카오톡 공유하기
 */
export const shareToKakao = ({ title, description, imageUrl, linkUrl }) => {
  // 디버깅 로그 추가
  console.log("📤 카카오톡 공유 시도");
  console.log("- Kakao 객체:", window.Kakao);
  console.log("- 초기화 상태:", window.Kakao?.isInitialized());
  console.log("- 공유 URL:", linkUrl);
  console.log("- 이미지 URL:", imageUrl);

  if (!window.Kakao) {
    alert("카카오톡 SDK가 로드되지 않았습니다.");
    return;
  }

  if (!window.Kakao.isInitialized()) {
    alert("카카오톡 SDK가 초기화되지 않았습니다. 페이지를 새로고침해주세요.");
    return;
  }

  // ✅ 작동하는 기본 이미지 URL (카카오 공식 문서 예시)
  const defaultImage =
    imageUrl ||
    "https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png";

  try {
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: title,
        description: description,
        imageUrl: defaultImage,
        link: {
          mobileWebUrl: linkUrl,
          webUrl: linkUrl,
        },
      },
      buttons: [
        {
          title: "웹으로 보기",
          link: {
            mobileWebUrl: linkUrl,
            webUrl: linkUrl,
          },
        },
      ],
    });
    console.log("✅ 카카오톡 공유 요청 성공");
  } catch (error) {
    console.error("❌ 카카오톡 공유 에러:", error);
    alert(`공유하기에 실패했습니다: ${error.message}`);
  }
};
