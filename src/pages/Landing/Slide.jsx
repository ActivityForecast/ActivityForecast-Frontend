import FeatureCard from './FeatureCard';

export default function Slide({ slide }) {
  return (
    <article className="relative w-full flex-shrink-0 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden md:block md:w-1/2"
        style={{
          backgroundImage: `url(${slide.heroImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right center',
          backgroundSize: 'contain',
        }}
      />

      <div className="relative z-10 flex h-full flex-col justify-between px-6 py-7 sm:px-10 sm:py-8">
        <div className="max-w-xl">
          <h2 className="mt-2 whitespace-pre-line text-2xl font-bold text-white sm:text-3xl">
            {slide.title}
          </h2>
          <p className="mt-3 text-sm text-white/90">{slide.subtitle}</p>
        </div>

        <div className="mt-6 grid gap-4 max-w-2xl sm:grid-cols-2">
          <FeatureCard
            accentClass={slide.accentClass}
            feature={slide.feature1}
          />
          <FeatureCard
            accentClass={slide.accentClass}
            feature={slide.feature2}
          />
        </div>
      </div>
    </article>
  );
}
