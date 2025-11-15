export function mapWeatherToCard(res, displayYmd) {
  const d = res || {};
  const {
    datetime,
    temperature,
    temperatureUnit,
    condition,
    airQuality,
    airQualityIndex,
    icon,
  } = d;

  let dateText;
  if (displayYmd) {
    const [y, m, dd] = displayYmd.split('-').map(Number);
    dateText = `${y}년 ${m}월 ${dd}일`;
  } else {
    const date = datetime ? new Date(datetime) : new Date();
    dateText = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  }

  const temperatureText =
    typeof temperature === 'number'
      ? `${Math.round(temperature)}${temperatureUnit || '°C'}`
      : `-°C`;

  const pmText = airQuality || '미세먼지 정보 없음';

  const pmColorClass = (() => {
    if (typeof airQualityIndex === 'number') {
      if (airQualityIndex <= 1) return 'bg-[#22c55e]'; 
      if (airQualityIndex === 2) return 'bg-[#22c55e]';
      if (airQualityIndex === 3) return 'bg-[#eab308]';
      if (airQualityIndex === 4) return 'bg-[#f97316]';
      return 'bg-[#ef4444]';
    }
    const s = (airQuality || '').replace(/\s/g, '');
    if (['매우좋음','좋음'].includes(s)) return 'bg-[#22c55e]';
    if (s === '보통') return 'bg-[#eab308]';
    if (s === '나쁨') return 'bg-[#f97316]';
    if (s === '매우나쁨') return 'bg-[#ef4444]';
    return 'bg-gray-300';
  })();

  const iconKey = (() => {
    if (!icon) return 'sun';
    const code = String(icon);
    const group = code.slice(0, 2);
    switch (group) {
      case '01': return code.endsWith('n') ? 'moon' : 'sun';
      case '02':
      case '03':
      case '04': return 'cloud';
      case '09':
      case '10':
      case '11': return 'rain';
      case '13': return 'snow';
      case '50': return 'cloud';
      default: return 'sun';
    }
  })();

  return {
    dateText,
    temperature: temperatureText,
    conditionText: condition,
    pmText,
    pmColorClass,
    iconKey,
  };
}
