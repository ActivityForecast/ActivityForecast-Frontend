import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ActivityCard from 'components/ActivityCard';
import ActivityDetailCard from './ActivityDetailCard';
import Button from 'components/Button';
import { recommendedActivities } from 'mocks/Activities';
import { useLocationStore } from 'stores/location';
import { DEFAULT_LOCATION } from 'constants/defaultLocation';
import { useWeather } from 'hooks/useWeather';
import { mapWeatherToCard } from 'utils/mapWeatherToCard';
import { formatMd } from 'utils/formatMd';
import CalendarAddedModal from './CalendarModal';

const ACTIVITY_DETAILS = {
  soccer: { difficulty: 3, comfortPercent: 80 },
  running: { difficulty: 2, comfortPercent: 75 },
  basketball: { difficulty: 4, comfortPercent: 62 },
};

function getLocationName(sel) {
  return sel?.name || sel?.label || sel?.city || sel?.address || '선택한 위치';
}

export default function DetailPage() {
  const [openAdded, setOpenAdded] = useState(false);
  const [params] = useSearchParams();
  const date = params.get('date') || new Date().toISOString().slice(0, 10);

  const { selected, setSelected } = useLocationStore();
  useEffect(() => {
    if (!selected) setSelected(DEFAULT_LOCATION);
  }, [selected, setSelected]);

  const { isLoading, error, data } = useWeather(date);
  const uiWeather = useMemo(
    () => (data ? mapWeatherToCard(data) : null),
    [data]
  );

  const locName = getLocationName(selected);

  const [activeId, setActiveId] = useState(null);
  const active = recommendedActivities.find((a) => a.id === activeId) || null;

  const mergedActive = activeId
    ? { ...active, ...(ACTIVITY_DETAILS[activeId] || {}) }
    : null;

  const handleCardClick = (id) => setActiveId(id);
  const handleBack = () => setActiveId(null);
  const handleRetry = () => alert('현재 다른 추천 미구현입니다.');
  const handleCalendar = () => {
    setOpenAdded(true);
  };

  return (
    <main className="bg-gray-50 min-h-screen px-4 py-8 flex items-center justify-center">
      <section className="w-full max-w-[840px] rounded-md border border-gray-200 bg-white p-8">
        <div className="text-center max-w-[600px] mx-auto">
          <h2 className="text-2xl font-semibold text-black">추천 활동</h2>

          {isLoading ? (
            <p className="mt-4 text-lg text-gray-600">날씨 불러오는 중…</p>
          ) : error ? (
            <p className="mt-4 text-lg text-red-600">
              날씨 정보를 가져오지 못했습니다.
            </p>
          ) : uiWeather ? (
            <p className="mt-4 text-lg text-gray-700">
              {formatMd(date)} <span className="font-semibold">{locName}</span>
              의 날씨는{' '}
              <span className="font-semibold">{uiWeather.conditionText}</span>
              입니다.
            </p>
          ) : (
            <p className="mt-4 text-lg text-gray-600">
              표시할 날씨 정보가 없습니다.
            </p>
          )}

          {uiWeather && (
            <div className="mt-5 px-6 sm:px-8 py-2 w-full h-14 flex justify-between items-center text-white text-lg bg-[#3b82f6] rounded-full">
              <p>{uiWeather.temperature}</p>
              {uiWeather.pmText ? (
                <div className="flex gap-2 sm:gap-3 items-center">
                  <span
                    className={[
                      'inline-block h-5 w-5 rounded-full',
                      uiWeather.pmColorClass || 'bg-gray-300',
                    ].join(' ')}
                  />
                  {uiWeather.pmText}
                </div>
              ) : (
                <div className="opacity-80 text-base">대기질 정보 없음</div>
              )}
            </div>
          )}

          {!activeId && (
            <>
              <div className="mt-8">
                <div className="mx-auto flex gap-2 justify-between max-w-[900px]">
                  {recommendedActivities.map((act) => (
                    <ActivityCard
                      key={act.id}
                      src={act.src}
                      label={act.label}
                      size="lg"
                      onClick={() => handleCardClick(act.id)}
                    />
                  ))}
                </div>
              </div>

              <Button
                onClick={handleRetry}
                className="mt-6"
                size="w-[180px] h-12"
              >
                다른 추천받기
              </Button>
            </>
          )}

          {activeId && (
            <ActivityDetailCard
              activity={{
                ...mergedActive,
                gears: mergedActive?.gears || ['운동화', '물병'],
                notes: mergedActive?.notes || ['충분한 스트레칭', '수분 보충'],
              }}
              weather={uiWeather}
              onBack={handleBack}
              onCalendar={handleCalendar}
            />
          )}
          <CalendarAddedModal
            isOpen={openAdded}
            onClose={() => setOpenAdded(false)}
            dateYmd={date}
            locationName={getLocationName(selected)}
            activityLabel={mergedActive?.label || ''}
          />
        </div>
      </section>
    </main>
  );
}
