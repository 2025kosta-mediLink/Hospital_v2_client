/**
 * 카카오 SDK 초기화
 */
export const initKakaoSdk = () => {
  // 이미 초기화되어 있으면 스킵
  if (window.Kakao?.isInitialized()) {
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

      if (kakaoKey) {
        try {
          window.Kakao.init(kakaoKey);
        } catch (error) {
          console.error("❌ 카카오 SDK 초기화 에러:", error);
        }
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
  if (!window.Kakao) {
    alert("카카오톡 SDK가 로드되지 않았습니다.");
    return;
  }

  if (!window.Kakao.isInitialized()) {
    alert("카카오톡 SDK가 초기화되지 않았습니다. 페이지를 새로고침해주세요.");
    return;
  }

  // ✅ 환경변수 또는 현재 origin 사용
  const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  const shareUrl = linkUrl || window.location.href;

  // localhost를 실제 URL로 대체 (개발 환경)
  const finalUrl = shareUrl.includes("localhost")
    ? shareUrl.replace(window.location.origin, baseUrl)
    : shareUrl;

  // ✅ 병원/의료 관련 기본 이미지 URL
  const defaultImage =
    imageUrl ||
    "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FmCrZD%2FdJMcai2KTzH%2FAAAAAAAAAAAAAAAAAAAAAN8jFnO_X9StfMCY47mdztDkYP2S0jzcbMNfXRkRSxib%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1764514799%26allow_ip%3D%26allow_referer%3D%26signature%3DfjqD6TYYaMQdFZgsVMG%252BIPjUU4E%253D";

  try {
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: title,
        description: description,
        imageUrl: defaultImage,
        link: {
          mobileWebUrl: finalUrl,
          webUrl: finalUrl,
        },
      },
      buttons: [
        {
          title: "웹으로 보기",
          link: {
            mobileWebUrl: finalUrl,
            webUrl: finalUrl,
          },
        },
      ],
    });
  } catch (error) {
    console.error("❌ 카카오톡 공유 에러:", error);
    alert(`공유하기에 실패했습니다: ${error.message}`);
  }
};
