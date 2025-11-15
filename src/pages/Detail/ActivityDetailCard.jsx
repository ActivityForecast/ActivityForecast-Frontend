export default function ActivityDetailCard({
  activity,
  weather,
  onBack,
  onCalendar,
}) {
  if (!activity) return null;

  const difficultyLabel =
    activity.difficulty >= 5
      ? '매우 높음'
      : activity.difficulty === 4
      ? '높음'
      : activity.difficulty === 3
      ? '중'
      : activity.difficulty === 2
      ? '낮음'
      : '매우 낮음';

  const comfortPercent =
    typeof activity.comfortPercent === 'number'
      ? activity.comfortPercent
      : null;

  const comfortBadge =
    comfortPercent == null ? '쾌적도 정보 없음' : `쾌적도 ${comfortPercent}`;

  const comfortBadgeColor =
    comfortPercent == null
      ? 'bg-gray-200 text-gray-600'
      : comfortPercent >= 70
      ? 'bg-green-100 text-green-700'
      : comfortPercent >= 40
      ? 'bg-amber-100 text-amber-700'
      : 'bg-red-100 text-red-700';

  return (
    <div className="mt-6 rounded-2xl border min-h-96 border-gray-200 shadow-sm bg-white">
      <div className="px-6 pt-5 pb-2 flex items-center">
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-800"
          aria-label="뒤로"
        >
          ← 목록으로
        </button>
        <h3 className="flex flex-1 justify-center text-xl font-semibold text-gray-900">
          {activity.label}
        </h3>
      </div>

      <div className="p-6 h-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="overflow-hidden rounded-xl">
            <img
              src={activity.src}
              alt={activity.label}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {activity.notes?.length > 0 && (
            <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
              <div className="font-semibold mb-2">주의사항</div>
              <ul className="list-disc ml-4 space-y-1">
                {activity.notes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="md:col-span-2 flex flex-col">
          <div>
            <div className="mb-3 flex items-center justify-end gap-2">
              <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-3 py-1 text-xs">
                난이도 {difficultyLabel}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs ${comfortBadgeColor}`}
              >
                {comfortBadge}
              </span>
            </div>

{/* 준비물은 따로 데이터가 준비된게 api에서 없어보여서 주석처리 하겠습니다.
            <div className="text-lg font-semibold text-gray-900 mb-3">
              준비물
            </div>
            <div className="flex flex-wrap gap-2">
              {(activity.gears || []).map((g, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-full bg-blue-200 px-3 py-1 text-sm text-gray-800"
                >
                  <span aria-hidden></span>
                  {g}
                </span>
              ))}
            </div>
            */}
          </div>

          <div className="mt-5 rounded-2xl border border-gray-200 p-5">
            <div className="text-lg font-semibold text-gray-900 mb-3">
              날씨
            </div>
            {weather ? (
              <div>
                <div className="text-4xl font-semibold">
                  {weather.temperature}
                </div>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-sm text-gray-700">
                    {weather.conditionText}
                  </div>
                  {weather.pmText ? (
                    <div className="flex items-center gap-2">
                      <span
                        className={[
                          'inline-block h-3 w-3 rounded-full',
                          weather.pmColorClass || 'bg-gray-300',
                        ].join(' ')}
                      />
                      <span className="text-sm text-gray-700">
                        {weather.pmText}
                      </span>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">
                      대기질 정보 없음
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                날씨 정보를 불러오는 중…
              </div>
            )}
          </div>

          <button
            onClick={onCalendar}
            className="mt-auto w-full h-12 rounded-xl bg-gray-100 text-black text-sm hover:bg-gray-200"
          >
            캘린더 추가
          </button>
        </div>
      </div>
    </div>
  );
}
