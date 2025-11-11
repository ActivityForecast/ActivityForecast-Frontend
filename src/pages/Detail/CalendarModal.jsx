import Modal, { ModalFooter } from 'components/Modal/Modal';

const WEEK_KO = ['일','월','화','수','목','금','토'];
const fromYmd = (s) => {
  const [y,m,d] = s.split('-').map(Number);
  return new Date(y, (m||1)-1, d||1);
};
const formatDateKo = (ymd) => {
  const d = fromYmd(ymd);
  return `${d.getMonth()+1}월 ${d.getDate()}일 (${WEEK_KO[d.getDay()]})`;
};

export default function CalendarAddedModal({
  isOpen,
  onClose,
  dateYmd,       
  locationName,    
  activityLabel,     
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hasCloseButton={false}
      title="캘린더에 일정이 추가되었습니다."
      containerStyle={{ width: 450, paddingBottom: 0 }}
      isCloseOutsideClick
    >
      <div className="px-6 pt-2 pb-4 text-center">
        <div className="text-base text-gray-600 mt-1">
          {formatDateKo(dateYmd)}
        </div>
        <div className="text-base text-gray-500">{locationName}</div>
        <div className="text-base text-gray-500">{activityLabel}</div>
      </div>

      <div className="border-t border-gray-200" />

      <ModalFooter>
        <button
          type="button"
          onClick={onClose}
          className="w-full h-12 mb-2 rounded-md text-sm font-medium hover:bg-gray-200"
        >
          완료
        </button>
      </ModalFooter>
    </Modal>
  );
}
