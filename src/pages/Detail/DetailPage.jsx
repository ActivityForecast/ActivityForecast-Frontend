import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ActivityCard from 'components/ActivityCard';
import ActivityDetailCard from './ActivityDetailCard';
import Button from 'components/Button';
import { useLocationStore } from 'stores/location';
import { DEFAULT_LOCATION } from 'constants/defaultLocation';
import { useWeather } from 'hooks/useWeather';
import { mapWeatherToCard } from 'utils/mapWeatherToCard';
import { formatMd } from 'utils/formatMd';
import CalendarAddedModal from './CalendarModal';
import { fetchMainRecommendationsForCards } from 'api/recommendation';

function getLocationName(sel) {
  return sel?.name || sel?.label || sel?.city || sel?.address || '선택한 위치';
}

const pad2 = (n) => String(n).padStart(2, '0');

const toISODateTime = (ymd, time) => {
  const [h = '15', m = '00'] = (time || '15:00').split(':');
  const hh = pad2(h);
  const mm = pad2(m);
  return new Date(`${ymd}T${hh}:${mm}:00`).toISOString();
};

export default function DetailPage() {
  const [openAdded, setOpenAdded] = useState(false);
  const [params] = useSearchParams();

  const defaultDate = new Date().toISOString().slice(0, 10);
  const date = params.get('date') || defaultDate;
  const time = params.get('time') || '15:00';

  const { selected, setSelected } = useLocationStore();
  useEffect(() => {
    if (!selected) setSelected(DEFAULT_LOCATION);
  }, [selected, setSelected]);

  const { isLoading, error, data } = useWeather(date, time);
 const uiWeather = useMemo(
  () => (data ? mapWeatherToCard(data, date) : null),
  [data, date]
);


  const locName = getLocationName(selected);
  const [recActivities, setRecActivities] = useState([]);
  const [recLoading, setRecLoading] = useState(false);
  const [recError, setRecError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!selected) return;

    const fetchRecs = async () => {
      setRecLoading(true);
      setRecError('');

      try {
        const locationName =
          selected?.address ||
          selected?._raw?.address ||
          selected?.addressName ||
          selected?.fullAddress ||
          selected?.locationName ||
          (selected?.region_1depth_name && selected?.region_2depth_name
            ? `${selected.region_1depth_name} ${selected.region_2depth_name}`
            : null) ||
          DEFAULT_LOCATION?.address ||
          DEFAULT_LOCATION?.locationName ||
          DEFAULT_LOCATION?.name;

        const targetDatetime = toISODateTime(date, time);

        const list = await fetchMainRecommendationsForCards({
          locationName,
          targetDatetime,
        });

        setRecActivities(list);
      } catch (e) {
        console.error(e);
        const msg =
          e?.response?.data?.message ||
          '추천 활동을 불러오는 데 실패했어요.';
        setRecError(msg);
      } finally {
        setRecLoading(false);
      }
    };

    fetchRecs();
  }, [selected, date, time, retryCount]);

  const [activeId, setActiveId] = useState(null);
  const active = recActivities.find((a) => a.id === activeId) || null;

  const mergedActive = active
    ? {
        ...active,
        difficulty:
          active.raw && typeof active.raw.difficultyLevel === 'number'
            ? active.raw.difficultyLevel
            : 3,
        comfortPercent:
          active.raw && typeof active.raw.comfortScore === 'number'
            ? Math.round(active.raw.comfortScore * 100)
            : null,
      }
    : null;

  const handleCardClick = (id) => setActiveId(id);
  const handleBack = () => setActiveId(null);
  const handleRetry = () => {
    setRetryCount((c) => c + 1);
  };
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
              {formatMd(date)}{' '}
              <span className="font-semibold">{locName}</span>의 날씨는{' '}
              <span className="font-semibold">{uiWeather.conditionText}</span>
              입니다.
            </p>
          ) : (
            <div className="mx-auto w-full max-w-[480px] text-center h-60 rounded-md border border-gray-200 flex flex-col items-center justify-center text-sm text-gray-600">
            표시할 날씨 정보가 없습니다. <span className='mt-5'>활동예보는 3시간 예보에 맞춰 가장 가까운 시간으로 자동 조정됩니다. <br/> 오후 9시 이후 당일 날씨는 안 보여질 수 있습니다.</span>
          </div>
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
                {recLoading && (
                  <p className="mt-4 text-sm text-gray-500">
                    오늘의 추천 활동을 불러오는 중이에요...
                  </p>
                )}

                {recError && !recLoading && (
                  <p className="mt-4 text-sm text-red-500">{recError}</p>
                )}

                {!recLoading && !recError && recActivities.length === 0 && (
                  <p className="mt-4 text-sm text-gray-500">
                    아직 추천할 활동이 없어요. 위치를 다시 선택해 보세요.
                  </p>
                )}

                {!recLoading && recActivities.length > 0 && (
                  <div className="mx-auto flex gap-2 justify-between max-w-[900px]">
                    {recActivities.map((act) => (
                      <ActivityCard
                        key={act.id}
                        src={act.src}
                        label={act.label}
                        size="lg"
                        onClick={() => handleCardClick(act.id)}
                      />
                    ))}
                  </div>
                )}
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
                notes:
                  mergedActive?.notes || ['충분한 스트레칭', '수분 보충'],
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
