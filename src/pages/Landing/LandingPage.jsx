import { SLIDES } from 'constants/slide';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Slide from './Slide';
import { ReactComponent as LeftIcon } from 'assets/icons/left.svg';
import { ReactComponent as RightIcon } from 'assets/icons/right.svg';
export default function LandingPage() {
  const [index, setIndex] = useState(0);

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  };

  const goTo = (i) => setIndex(i);

  const current = SLIDES[index];

  return (
    <main className="min-h-screen bg-slate-900 flex justify-center items-start md:items-center px-4 py-6 md:py-10">
      <div className="w-full max-w-5xl">
        <section className="mb-6 flex items-center justify-between text-white">
          <div>
            <p className="text-xs font-medium text-blue-300">
              활동예보 · ActivityForecast
            </p>
            <h1 className="mt-2 text-xl sm:text-2xl font-bold md:text-3xl">
              날씨 기반 맞춤 활동 추천 서비스
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              지금 가입하고 추천활동을 확인해 보세요.
            </p>
          </div>
          <div className="hidden gap-2 md:flex">
            <Link
              to="/home"
              className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
            >
              지금 시작하기
            </Link>
            <Link
              to="/login"
              className="rounded-full border border-slate-500 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-800"
            >
              로그인
            </Link>
          </div>
        </section>

        <section className="relative rounded-3xl shadow-2xl overflow-hidden">
          <div className={`${current.bgClass} transition-colors duration-500`}>
            <div className="relative min-h-[520px] md:h-[620px]">
              <div
                className="flex h-full transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${index * 100}%)`,
                }}
              >
                {SLIDES.map((slide) => (
                  <Slide key={slide.id} slide={slide} />
                ))}
              </div>

              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 flex items-center justify-center  -translate-y-1/2 rounded-full bg-black/20 px-3 py-2 backdrop-blur hover:bg-black/35"
              >
                <LeftIcon />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 flex items-center justify-center  -translate-y-1/2 rounded-full bg-black/20 px-3 py-2 backdrop-blur hover:bg-black/35"
              >
                <RightIcon />
              </button>

              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                {SLIDES.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goTo(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === index ? 'w-6 bg-white' : 'w-2 bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-4 flex gap-2 md:hidden">
          <Link
            to="/home"
            className="flex-1 rounded-full bg-blue-500 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-600"
          >
            지금 시작하기
          </Link>
          <Link
            to="/login"
            className="flex-1 rounded-full border border-slate-600 px-4 py-3 text-center text-sm font-semibold text-slate-100 hover:bg-slate-800"
          >
            로그인
          </Link>
        </div>
      </div>
    </main>
  );
}
