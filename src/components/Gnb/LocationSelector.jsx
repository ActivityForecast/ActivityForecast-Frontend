import { useMemo, useState } from 'react';
import { ReactComponent as LocationIcon } from 'assets/icons/location.svg';
import { ReactComponent as DownArrowIcon } from 'assets/icons/downarrow.svg';
import { useLocationStore } from 'stores/location';
import LocationModal from './LocationModal';


export default function LocationSelector() {
  const [open, setOpen] = useState(false);
  const { selected, setSelected } = useLocationStore();
  const label = useMemo(() => selected?.name || '서울시 마포구', [selected]);

  return (
    <>
      <div
        className="flex items-center gap-1 sm:gap-2 font-medium text-lg sm:text-xl cursor-pointer select-none"
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
      >
        <LocationIcon /> <span
          className="
            max-w-[95px] overflow-hidden text-ellipsis whitespace-nowrap
            sm:max-w-none
          "
        >
        {label}</span>
        <DownArrowIcon />
      </div>

      {open && (
        <LocationModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onConfirm={(loc) => setSelected(loc)}
        />
      )}
    </>
  );
}


