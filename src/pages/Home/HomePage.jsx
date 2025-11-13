import ActivityCard from 'components/ActivityCard';
import Button from 'components/Button';
import WeatherCard from 'components/WheatherCard';
import { recommendedActivities } from 'mocks/Activities';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from 'stores/auth';
import CalendarModal from './CalendarModal';
import { useWeather } from 'hooks/useWeather';
import { mapWeatherToCard } from 'utils/mapWeatherToCard';
import { useLocationStore } from 'stores/location';
import { DEFAULT_LOCATION } from 'constants/defaultLocation';

const pad2 = (n) => String(n).padStart(2, '0');
const toYMD = (d) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

export default function HomePage() {
  const navigate = useNavigate();
  const { accessToken, isLoading } = useAuthStore();
  const isLoggedIn = !!accessToken;
  const [pickedDate, setPickedDate] = useState(() => toYMD(new Date()));
  const minDate = toYMD(new Date()); // 오늘
  const maxDate = toYMD(addDays(new Date(), 4)); //+4일(5일까지)
  const { selected, setSelected } = useLocationStore();
  const {
    isLoading: wxLoading,
    error: wxError,
    data: todayRes,
  } = useWeather(pickedDate);
  const uiWeather = useMemo(
    () => (todayRes ? mapWeatherToCard(todayRes) : null),
    [todayRes]
  );

  const [openCalendar, setOpenCalendar] = useState(false);

  const handleOpenCalendar = () => setOpenCalendar(true);
  const handleCloseCalendar = () => setOpenCalendar(false);
  const handleApplyDate = (dateStr) => {
    setPickedDate(dateStr);
    setOpenCalendar(false);
  };
  const handleLoginClick = () => navigate('/login');

  useEffect(() => {
    if (!selected) setSelected(DEFAULT_LOCATION);
  }, [selected, setSelected]);

  return (
    <main className="bg-gray-50 min-h-screen px-4 py-8 flex items-center justify-center">
      <section className="w-full max-w-[840px] rounded-md border border-gray-200 bg-white p-8">
        {!selected ? (
          <div className="mx-auto w-full max-w-[480px] h-60 rounded-md border border-gray-200 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-gray-700">
                날씨를 보려면 위치를 선택하세요.
              </p>
            </div>
          </div>
        ) : wxLoading ? (
          <div className="mx-auto w-full max-w-[480px] h-60 rounded-md border border-gray-200 flex items-center justify-center text-sm text-gray-600">
            날씨 불러오는 중…
          </div>
        ) : wxError ? (
          <div className="mx-auto w-full max-w-[480px] h-60 rounded-md border border-gray-200 flex items-center justify-center text-sm text-red-600">
            날씨 정보를 가져오지 못했습니다.
          </div>
        ) : uiWeather ? (
          <WeatherCard weather={uiWeather} />
        ) : (
          <div className="mx-auto w-full max-w-[480px] h-60 rounded-md border border-gray-200 flex items-center justify-center text-sm text-gray-600">
            표시할 날씨 정보가 없습니다.
          </div>
        )}

        <hr className="mx-auto my-6 w-full max-w-[480px] border-gray-300" />

        <div className="text-center max-w-[480px] mx-auto">
          <h2 className="text-2xl font-semibold text-black">추천 활동</h2>
          <p className="mt-4 text-sm text-gray-600">
            날씨에 가장 적합한 활동을 추천해드려요
          </p>

          {isLoading && (
            <p className="mt-10 text-sm text-gray-500">불러오는 중…</p>
          )}

          {!isLoading && !isLoggedIn && (
            <>
              <p className="mt-14 text-sm leading-relaxed text-gray-500">
                로그인하면 현재 날씨에 맞는 맞춤 활동을 추천받을 수 있어요
              </p>
              <Button
                onClick={handleLoginClick}
                className="py-2 mt-6"
                size="w-32"
              >
                로그인하기
              </Button>
            </>
          )}

          {!isLoading && isLoggedIn && (
            <div className="mt-8">
              <div className="mx-auto flex justify-between max-w-[520px]">
                {recommendedActivities.map((act) => (
                  <ActivityCard key={act.id} src={act.src} label={act.label} />
                ))}
              </div>
              <div className="mt-8 flex gap-4">
                <Button
                  onClick={() => navigate(`/detail?date=${pickedDate}`)}
                  size="w-[240px] h-[56px]"
                  className="text-sm sm:text-base"
                >
                  맞춤 추천 확인
                </Button>
                <Button
                  onClick={handleOpenCalendar}
                  size="w-[240px] h-[56px]"
                  className="text-sm sm:text-base"
                >
                  다른 날짜 고르기
                </Button>
              </div>
            </div>
          )}
        </div>

        <CalendarModal
          isOpen={openCalendar}
          initialDate={pickedDate}
          onApply={handleApplyDate}
          onClose={handleCloseCalendar}
          min={minDate}
          max={maxDate}
        />
      </section>
    </main>
  );
}
