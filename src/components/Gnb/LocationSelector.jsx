import { ReactComponent as LocationIcon } from 'assets/icons/location.svg';
import { ReactComponent as DownArrowIcon } from 'assets/icons/downarrow.svg';

function LocationSelector() {
  return (
    <div className="flex items-center gap-1 sm:gap-2 font-medium text-lg sm:text-xl">
      <LocationIcon />
      서울시 마포구
      <DownArrowIcon />
    </div>
  );
}

export default LocationSelector;
