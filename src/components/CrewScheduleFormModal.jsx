import { useState, useEffect, useMemo, useRef } from 'react';
import Modal, { ModalFooter } from 'components/Modal/Modal';
import InputField from 'components/InputField';
import Button from 'components/Button';
import CrewActivitySelectModal from 'components/CrewActivitySelectModal';
import CalendarModal from 'components/CrewCreativeCalenderModal';
import LocationModal from 'components/Gnb/LocationModal';
import activities from 'constants/activities';

// 시간 선택 모달 컴포넌트
function TimeSelectModal({ isOpen, onClose, value, onConfirm }) {
  const timeListRef = useRef(null);
  const scrollEndTimerRef = useRef(null);
  const timeItemHeight = 48;
  const [timeListSpacer, setTimeListSpacer] = useState(64);
  const isAutoSnappingRef = useRef(false);
  const [draftTime, setDraftTime] = useState(value || '12:00');

  // 시간 옵션 생성 (10분 단위)
  const timeOptions = useMemo(() => {
    const options = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 10) {
        const hour = String(h).padStart(2, '0');
        const minute = String(m).padStart(2, '0');
        const timeValue = `${hour}:${minute}`;
        const displayHour = h < 12 ? `오전 ${h === 0 ? 12 : h}` : `오후 ${h === 12 ? 12 : h - 12}`;
        options.push({ value: timeValue, label: `${displayHour}시 ${minute}분` });
      }
    }
    return options;
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const el = timeListRef.current;
    if (!el) return;

    const spacer = Math.max(0, Math.round(el.clientHeight / 2 - timeItemHeight / 2));
    setTimeListSpacer(spacer);

    const currentIndex = timeOptions.findIndex((opt) => opt.value === (value || '12:00'));
    const targetIndex = currentIndex >= 0 ? currentIndex : 72;
    const top = targetIndex * timeItemHeight;
    el.scrollTo({ top, behavior: 'auto' });
    setDraftTime(timeOptions[targetIndex]?.value || '12:00');
  }, [isOpen, timeOptions, value]);

  const scrollToTime = (index, behavior = 'smooth') => {
    const el = timeListRef.current;
    if (!el) return;
    const targetTop = index * timeItemHeight;
    isAutoSnappingRef.current = true;
    el.scrollTo({ top: targetTop, behavior });
    setTimeout(() => {
      isAutoSnappingRef.current = false;
    }, behavior === 'smooth' ? 260 : 0);
  };

  const handleTimeScroll = () => {
    const el = timeListRef.current;
    if (!el || isAutoSnappingRef.current) return;

    if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
    scrollEndTimerRef.current = setTimeout(() => {
      const idx = Math.round(el.scrollTop / timeItemHeight);
      const closest = Math.min(timeOptions.length - 1, Math.max(0, idx));
      setDraftTime(timeOptions[closest].value);
      scrollToTime(closest, 'smooth');
    }, 200);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="시간 선택">
      <div className="mt-2">
        <div className="relative h-56">
          <div className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 h-12 border-y border-gray-200" />
          <div
            ref={timeListRef}
            onScroll={handleTimeScroll}
            className="h-56 overflow-y-auto no-scrollbar"
            style={{ paddingTop: timeListSpacer, paddingBottom: timeListSpacer }}
          >
            {timeOptions.map((opt, index) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setDraftTime(opt.value);
                  scrollToTime(index);
                }}
                className={`w-full text-center h-12 leading-none flex items-center justify-center transition transform duration-200 ease-out ${
                  draftTime === opt.value
                    ? 'text-black font-bold scale-110'
                    : 'text-gray-400 opacity-60'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <ModalFooter>
          <button
            type="button"
            className="flex-1 rounded-xl bg-[#3B82F6] text-white py-3"
            onClick={() => {
              onConfirm?.(draftTime);
              onClose();
            }}
          >
            확인
          </button>
        </ModalFooter>
      </div>
    </Modal>
  );
}

export default function CrewScheduleFormModal({
  isOpen,
  onClose,
  title = '새 일정 만들기',
  initialData = null, // 수정 모드일 때 기존 데이터
  color = '#FC8385',
  onSave, // 저장 콜백 (data) => void
  onDelete, // 삭제 콜백 (수정 모드일 때만)
  showDelete = false, // 삭제 버튼 표시 여부
}) {
  const [activity, setActivity] = useState(null);
  const [place, setPlace] = useState('');
  const [locationId, setLocationId] = useState(null);
  const [locationLatitude, setLocationLatitude] = useState(null);
  const [locationLongitude, setLocationLongitude] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [gear, setGear] = useState('');

  const [openActivityModal, setOpenActivityModal] = useState(false);
  const [openDatePickerModal, setOpenDatePickerModal] = useState(false);
  const [openTimeModal, setOpenTimeModal] = useState(false);
  const [openLocationModal, setOpenLocationModal] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    if (isOpen && initialData) {
      setActivity(activities.find((a) => a.name === initialData.activity) || null);
      setPlace(initialData.place || '');
      setLocationId(initialData.locationId || null);
      setLocationLatitude(initialData.locationLatitude || null);
      setLocationLongitude(initialData.locationLongitude || null);
      setDate(initialData.date || '');
      setTime(initialData.time || '');
      setGear(initialData.gear || '');
    } else if (isOpen && !initialData) {
      // 생성 모드일 때 초기화
      setActivity(null);
      setPlace('');
      setLocationId(null);
      setLocationLatitude(null);
      setLocationLongitude(null);
      setDate('');
      setTime('');
      setGear('');
    }
  }, [isOpen, initialData]);

  const handleSave = () => {
    if (!activity || !date || !time) {
      alert('활동, 날짜, 시간을 모두 선택해주세요.');
      return;
    }

    const data = {
      date,
      label: activity.name || activity.label || '활동',
      activity: activity.name,
      place,
      locationId,
      locationLatitude,
      locationLongitude,
      time,
      gear,
    };

    onSave?.(data);
  };

  const handleDelete = () => {
    if (window.confirm('정말 이 일정을 삭제하시겠습니까?')) {
      onDelete?.();
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        style={{ '--modal-max-h-sm': 'calc(100dvh - 80px)' }}
      >
        <div className="flex flex-col gap-4 mt-2 pb-4">
          {/* 활동 */}
          <label className="font-semibold text-black">활동</label>
          <div onClick={() => setOpenActivityModal(true)} className="cursor-pointer">
            <InputField
              id="activity"
              type="text"
              placeholder="활동 선택"
              value={activity?.name || ''}
              onChange={() => {}}
              readOnly
              className="cursor-pointer"
            />
          </div>

          {/* 장소 */}
          <label className="font-semibold text-black">장소</label>
          <div onClick={() => setOpenLocationModal(true)} className="cursor-pointer">
            <InputField
              id="place"
              type="text"
              placeholder="장소 검색"
              value={place}
              onChange={() => {}}
              readOnly
              className="cursor-pointer"
            />
          </div>

          {/* 날짜 */}
          <label className="font-semibold text-black">날짜</label>
          <div onClick={() => setOpenDatePickerModal(true)} className="cursor-pointer">
            <InputField
              id="date"
              type="text"
              placeholder="날짜 선택"
              value={date ? new Date(date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }) : ''}
              onChange={() => {}}
              readOnly
              className="cursor-pointer"
            />
          </div>

          {/* 시간 */}
          <label className="font-semibold text-black">시간</label>
          <div
            onClick={() => setOpenTimeModal(true)}
            className="cursor-pointer rounded-xl border border-gray-300 px-4 py-3 text-md sm:py-4 sm:text-lg text-black bg-white"
          >
            {time
              ? (() => {
                  const [h, m] = time.split(':').map(Number);
                  const displayHour = h < 12 ? `오전 ${h === 0 ? 12 : h}` : `오후 ${h === 12 ? 12 : h - 12}`;
                  return `${displayHour}시 ${String(m).padStart(2, '0')}분`;
                })()
              : '시간 선택'}
          </div>

          {/* 준비물 */}
          <label className="font-semibold text-black">준비물</label>
          <InputField
            id="gear"
            type="text"
            placeholder="리스트 입력"
            value={gear}
            onChange={(e) => setGear(e.target.value)}
          />

          <ModalFooter>
            <div className={`flex gap-2 w-full ${showDelete ? '' : 'justify-end'}`}>
              <Button
                type="button"
                styleType="solid"
                className={showDelete ? 'flex-1' : 'w-full'}
                onClick={handleSave}
              >
                {initialData ? '수정' : '생성'}
              </Button>
              {showDelete && (
                <Button
                  type="button"
                  styleType="outlined"
                  className="flex-1"
                  onClick={handleDelete}
                >
                  삭제
                </Button>
              )}
            </div>
          </ModalFooter>
        </div>
      </Modal>

      {/* 활동 선택 모달 */}
      <CrewActivitySelectModal
        isOpen={openActivityModal}
        onClose={() => setOpenActivityModal(false)}
        onConfirm={(selectedId) => {
          const selectedActivity = activities.find((a) => a.id === selectedId);
          setActivity(selectedActivity || null);
          setOpenActivityModal(false);
        }}
        activities={activities}
        initialSelected={activity?.id || null}
      />

      {/* 날짜 선택 모달 */}
      <CalendarModal
        isOpen={openDatePickerModal}
        onClose={() => setOpenDatePickerModal(false)}
        initialDate={date ? date.split('T')[0] : undefined}
        title="날짜를 선택해주세요"
        onApply={(selectedDate) => {
          setDate(selectedDate);
          setOpenDatePickerModal(false);
        }}
      />

      {/* 시간 선택 모달 */}
      <TimeSelectModal
        isOpen={openTimeModal}
        onClose={() => setOpenTimeModal(false)}
        value={time}
        onConfirm={(selectedTime) => {
          setTime(selectedTime);
        }}
      />

      {/* 장소 검색 모달 */}
      <LocationModal
        isOpen={openLocationModal}
        onClose={() => setOpenLocationModal(false)}
        onConfirm={(location) => {
          setPlace(location.name || location.address || '');
          // locationId는 숫자여야 함. _raw 객체에서 실제 locationId를 확인
          const rawLocation = location._raw || location;
          const locId = rawLocation.locationId || location.locationId || location.id;
          // locationId가 숫자이고 0보다 크면 사용, 그렇지 않으면 0 (백엔드에서 새 location 생성)
          const parsedId = typeof locId === 'number' && locId > 0 
            ? locId 
            : (typeof locId === 'string' && /^\d+$/.test(locId) && parseInt(locId, 10) > 0
              ? parseInt(locId, 10)
              : 0);
          setLocationId(parsedId);
          setLocationLatitude(location.latitude || null);
          setLocationLongitude(location.longitude || null);
          setOpenLocationModal(false);
        }}
      />
    </>
  );
}

