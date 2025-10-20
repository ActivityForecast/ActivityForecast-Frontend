import { useState } from 'react';
import { ReactComponent as LocationIcon } from 'assets/icons/location.svg';
import { ReactComponent as DownArrowIcon } from 'assets/icons/downarrow.svg';
import Modal, { ModalFooter } from 'components/Modal/Modal';

export default function LocationSelector() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="flex items-center gap-1 sm:gap-2 font-medium text-lg sm:text-xl cursor-pointer select-none"
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setOpen(true)}
      >
        <LocationIcon />
        서울시 마포구
        <DownArrowIcon />
      </div>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="위치 변경"
        isCloseOutsideClick={false}
        position="center"
      >
        <input
          type="text"
          placeholder="원하시는 위치를 검색하세요"
          className="mt-3 w-full rounded-lg bg-[#F3F8FD] px-4 py-3 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400"
        />
        <ModalFooter>
          <button
            className="w-full rounded-xl bg-[#0d99ff] py-3 text-white font-medium hover:bg-blue-500"
            onClick={() => setOpen(false)}
          >
            완료
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
}
