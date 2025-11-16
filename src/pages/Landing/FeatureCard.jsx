export default function FeatureCard({ accentClass, feature }) {
  return (
    <div className={`rounded-2xl ${accentClass} bg-opacity-80 p-3 sm:p-4`}>
      <div className="relative w-full overflow-hidden rounded-xl bg-white/80 aspect-[4/3]">
        <img
          src={feature.image}
          alt={feature.label}
          className="absolute inset-0 h-full w-full object-contain"
        />
      </div>

      <p className="mt-3 text-sm font-semibold text-slate-900">
        {feature.label}
      </p>
      <p className="mt-1 text-xs text-slate-800">{feature.description}</p>
    </div>
  );
}