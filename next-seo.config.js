/** @type {import('next-seo').DefaultSeoProps} */
const defaultSEOConfig = {
  defaultTitle: "인천재능고등학교",
  description:
    "인천재능고등학교 앱 관리자 페이지 입니다",
  canonical: "https://jhschool.xyz",
  openGraph: {
    url: "https://jhschool.xyz",
    title: "인천재능고등학교",
    description: "인천재능고등학교 앱 관리자 페이지 입니다",
    type: "website",
    images: [
      {
        url: "https://jhschool.xyz/page_logo.png",
        alt: "jhpagelogo",
      },
    ],
    site_name: "인천재능고등학교",
  },
};

export default defaultSEOConfig;
