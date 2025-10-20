import { ReactComponent as LocationIcon } from 'assets/icons/location.svg';

function LocationSelector() {
  return (
    <div className="flex items-center gap-2 font-medium text-xl">
      <LocationIcon />
      서울시 마포구
    </div>
  );
}

export default LocationSelector;
