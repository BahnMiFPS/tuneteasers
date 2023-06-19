const SERVER_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_DEPLOYMENT_URL
    : process.env.REACT_APP_LOCAL_URL

const allowedCountries = [
  { name: "Việt Nam", code: "VN", locale: "vi_VN" },
  { name: "United States", code: "US", locale: "en_US" },
  { name: "Korea", code: "KR", locale: "ko_KR" },
  { name: "Japan", code: "JP", locale: "ja_JP" },
  { name: "United Kingdom", code: "GB", locale: "en_GB" },
  { name: "Hong Kong", code: "HK", locale: "zh_HK" },
  { name: "Australia", code: "AU", locale: "en_AU" },
]

export { SERVER_URL, allowedCountries }
