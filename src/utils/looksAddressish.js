// 지도 위의 위치인지 판별하는 식

export function looksAddressish(q) {
  return /[시군구도광역특별자치동읍면로길대로번지역\s\d-]/.test(q);
}