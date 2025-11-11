import ActivityCard from 'components/ActivityCard';
import Button from 'components/Button';
import { recommendedActivities } from 'mocks/Activities';
import { useSearchParams } from 'react-router-dom';
import { useLocationStore } from 'stores/location';
import { formatMd} from 'utils/formatMd';

function getLocationName(sel) {
  return sel.name || sel.label || sel.city || sel.address;
}

export default function DetailPage() {
  const [params] = useSearchParams();
  const date = params.get('date') || new Date().toISOString().slice(0, 10);

  const { selected } = useLocationStore();
  const locName = getLocationName(selected);

  const sky = '맑음'; // 추가: 임시 날씨

  const handleRetry = () => {alert("현재 다른 추천 미구현입니다.")}
  const handleCardClick = () => {alert("현재 상세 카드 미구현입니다.")}

  return (
    <main className="bg-gray-50 min-h-screen px-4 py-8 flex items-center justify-center">
      <section className="w-full max-w-[840px] rounded-md border border-gray-200 bg-white p-8">
        <div className="text-center max-w-[600px] mx-auto">
          <h2 className="text-2xl font-semibold text-black">추천 활동</h2>
          <p className="mt-4 text-lg text-gray-700">
            {formatMd(date)} <span className="font-semibold">{locName}</span> 주변의 날씨는{' '}
            <span className="font-semibold">{sky}</span>입니다.
          </p>
          <div className='mt-5 px-6 sm:px-8 py-2 w-full h-14 flex justify-between items-center text-white text-lg bg-[#3b82f6] rounded-full'>
            {/* 추가: 현재 온도랑 날씨 mock데이터 초록원도 색상변경? */}
            <p>22°</p>
            <div className='flex gap-2 sm:gap-3 items-center'><span className="inline-block h-5 w-5 rounded-full bg-[#22c55e]" />미세먼지 맑음</div>
          </div>
          <div className='mt-8'>
            <div className="mx-auto flex gap-2 justify-between max-w-[900px]">
              {recommendedActivities.map((act) => (
                <ActivityCard
                  key={act.id}
                  src={act.src}
                  label={act.label}
                  size='lg'
                  onClick={handleCardClick}
                />
              ))}
            </div>
          </div>
          <Button onClick={handleRetry} className='mt-4' size='w-[180px] h-12'>다른 추천받기</Button>
        </div>
      </section>
    </main>
  );
}
