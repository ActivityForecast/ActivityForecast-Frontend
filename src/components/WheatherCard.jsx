
export default function WeatherCard({ weather }) {
  return (
    <div className="mx-auto w-full max-w-[480px] h-80 rounded-md bg-gradient-to-r from-[#3b5eea] to-[#9ad5ff] p-5 text-white flex items-center">

      <div className="flex-1 text-left">
        <div className="text-xs font-medium opacity-90 mb-2">
          {weather.dateText}
        </div>

        <div className="flex items-baseline mt-4 gap-2">
          <div className="text-3xl font-semibold leading-none">
            {weather.temperature}
          </div>
          <div className="text-base font-medium">{weather.conditionText}</div>
        </div>

        <div className="flex items-center gap-2 mt-6 text-sm">

          <span className="inline-block h-3 w-3 rounded-full bg-[#22c55e]" /> {/* 추가: 날씨에 따라서 색상을 변경해야 하는데 이건 날씨를 불러온 후에 어떻게 구현 할 지 고민해볼게요 */}
          <span className="font-medium">{weather.pmText}</span>
        </div>
      </div>

   {/* 추가: 여기도 날씨에 따라서 이미지를 변경해야 하는데 후에 어떻게 구현 할 지 고민해보겠습니다. */}
      <div className="flex items-center justify-end flex-none">
        <div className="h-12 w-12">
          해그림

        </div>
      </div>
    </div>
  );
}
