export default function FeatureCard({ accentClass, feature }) {
  return (
    <div className={`rounded-2xl ${accentClass} bg-opacity-80 p-3 sm:p-4`}>
      <div className="overflow-hidden rounded-xl bg-white/70">
        <img
          src={feature.image}
          alt={feature.label}
          className="h-32 w-full object-cover sm:h-36"
        />
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-900">
        {feature.label}
      </p>
      <p className="mt-1 text-xs text-slate-800">{feature.description}</p>
    </div>
  );
}
