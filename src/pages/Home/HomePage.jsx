import Button from 'components/Button';
import WeatherCard from 'components/WheatherCard';
import { mockWeather } from 'mocks/weather';
import { useNavigate } from 'react-router-dom';



export default function HomePage() {
  const navigate = useNavigate();
  const isLoggedIn = false; // 추가: 후에 auth Store로 교체할 예정

  const handleLoginClick = () => {
    navigate('/login');
  };

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

           {!isLoggedIn && (
            <>
              <p className="mt-14 text-sm leading-relaxed text-gray-500">
                로그인하면 현재 날씨에 맞는 맞춤 활동을 추천받을 수 있어요
              </p>

              <Button
                onClick={handleLoginClick}
                className="py-1 w-32 mt-6"
              >
                로그인하기
              </Button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
