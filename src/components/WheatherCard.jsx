import { ReactComponent as SunIcon } from 'assets/images/sun.svg';
import { ReactComponent as CloudIcon } from 'assets/images/cloud.svg';
import { ReactComponent as RainIcon } from 'assets/images/rain.svg';
import { ReactComponent as SnowIcon } from 'assets/images/snow.svg';

export default function WeatherCard({ weather }) {

   const renderIcon = () => {
    switch (weather.iconKey) {
      case 'cloud': return <CloudIcon className="w-24 h-24" />;
      case 'rain':  return <RainIcon className="w-24 h-24" />;
      case 'snow':  return <SnowIcon className="w-24 h-24" />;
      default:
        return <SunIcon className="w-24 h-24" />;
    }
  };
  return (
    <div className="mx-auto w-full max-w-[480px] h-60 rounded-md bg-gradient-to-r from-[#3b5eea] to-[#9ad5ff] p-5 text-white flex items-center">
      <div className="flex-1 text-left">
        <div className="text-xs font-medium opacity-90 mb-2">
          {weather.dateText}
        </div>

        <div className="flex items-baseline mt-4 gap-2">
          <div className="text-3xl font-semibold leading-none">
            {weather.temperature}
          </div>
          <div className="text-base font-medium">{weather.conditionText}</div>
        </div>

        <div className="flex items-center gap-2 mt-6 text-sm">
          <span
              className={[
                'inline-block h-3 w-3 rounded-full',
                weather.pmColorClass || 'bg-gray-300',
              ].join(' ')}
            /> 
          <span className="font-medium">{weather.pmText}</span>
        </div>
      </div>

      <div className="flex items-center justify-end flex-none">
        {renderIcon()}
      </div>
    </div>
  );
}
