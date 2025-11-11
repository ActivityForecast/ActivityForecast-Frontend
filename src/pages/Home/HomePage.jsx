import ActivityCard from 'components/ActivityCard';
import Button from 'components/Button';
import WeatherCard from 'components/WheatherCard';
import { recommendedActivities } from 'mocks/Activities';
import { mockWeather } from 'mocks/weather';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from 'stores/auth';
import CalendarModal from './CalendarModal';

export default function HomePage() {
 const navigate = useNavigate();

  const { accessToken, isLoading } = useAuthStore();
  const isLoggedIn = !!accessToken;

  const [openCalendar, setOpenCalendar] = useState(false);
  const [pickedDate, setPickedDate] = useState(() => new Date().toISOString().slice(0, 10));

  const handleOpenCalendar = () => setOpenCalendar(true);
  const handleCloseCalendar = () => setOpenCalendar(false);
  const handleApplyDate = (dateStr) => {
    setPickedDate(dateStr);
    setOpenCalendar(false);
    // navigate(`/detail?date=${dateStr}`); 추가: 페이지 이동 or 날짜를 저장 => api 연동이후
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

/* 추가: 운동 상세페이지 현재 구현 x
  const handleDetailClick = (id) => {
    navigate(`/detail/${id}`);
  };
*/

  return (
    <main className="bg-gray-50 min-h-screen px-4 py-8 flex items-center justify-center">
      <section className="w-full max-w-[840px] rounded-md border border-gray-200 bg-white p-8">
        <WeatherCard weather={mockWeather} />

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
                  <ActivityCard
                    key={act.id}
                    src={act.src}
                    label={act.label}
                  />
                ))}
              </div>
              <div className="mt-8 flex gap-4">
                <Button onClick={() => navigate(`/detail?date=${pickedDate}`)} size='w-[240px] h-[56px]' className='text-sm sm:text-base'>
                  맞춤 추천 확인
                </Button>
                <Button onClick={handleOpenCalendar} size='w-[240px] h-[56px]' className='text-sm sm:text-base'>
                  다른 날짜 고르기
                </Button>
              </div>
            </div>
          )}
        </div>
        <CalendarModal
          isOpen={openCalendar}
          initialDate={pickedDate}
          min={undefined}
          max={undefined}
          onApply={handleApplyDate}
          onClose={handleCloseCalendar}
        />
      </section>
    </main>
  );
}
