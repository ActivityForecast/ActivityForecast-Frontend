import { useState, useEffect } from 'react';
import CalendarBox from 'mocks/Calender';
import ActivityWidget from 'mocks/ActivityWidget';
import CrewScheduleFormModal from 'components/CrewScheduleFormModal';
import CalendarAddedModal from 'pages/Detail/CalendarModal';
import { useCrewStore } from 'stores/crew';
import activities from 'constants/activities';

export default function CrewListItem({
  id,
  name = '농구하조',
  current = 3,
  max = 5,
  color = '#FC8385',
  onLeave,
  onShare,
  members = [],
}) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  const [hovering, setHovering] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCalendarModal, setOpenCalendarModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [savedEventData, setSavedEventData] = useState(null);
  
  // API 연동을 위한 store
  const { schedulesByCrewId, loadCrewSchedules, addCrewSchedule, removeCrewSchedule } = useCrewStore();
  
  // 현재 년/월 계산
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12

  // API에서 일정 불러오기
  useEffect(() => {
    if (id) {
      loadCrewSchedules(id, currentYear, currentMonth);
    }
  }, [id, currentYear, currentMonth, loadCrewSchedules]);

  // API 일정을 CalendarBox 형식으로 변환
  const apiSchedules = schedulesByCrewId[id] || [];
  const crewEvents = apiSchedules.map((schedule) => ({
    date: schedule.date || schedule.scheduleDate || schedule.startDate,
    label: schedule.activity || schedule.activityName || schedule.label || '활동',
    activity: schedule.activity || schedule.activityName,
    place: schedule.place || schedule.location,
    time: schedule.time || schedule.startTime,
    gear: schedule.gear || schedule.equipment,
    crewScheduleId: schedule.crewScheduleId || schedule.id,
  }));

  const open = hovering || pinned;

  return (
    <div
      className="group relative w-full rounded-xl bg-white shadow-sm overflow-hidden transition-all duration-300"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* 좌측 컬러 바 */}
      <span
        className="absolute inset-y-0 left-0 w-4"
        style={{ backgroundColor: color }}
      />

      {/* 상단 영역 */}
      <div className="flex items-center justify-between pl-8 pr-6 py-2">
        <div className="text-base font-semibold text-black">{name}</div>

        <div className="flex items-center gap-3">
          {/* 인원 표시 */}
          <div
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-white text-sm"
            style={{ backgroundColor: color }}
          >
            <svg width="16" height="16" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${(pct / 100) * 94.2} 94.2`}
                transform="rotate(-90 18 18)"
              />
            </svg>
            <span className="font-medium">
              {current}/{max}
            </span>
          </div>

          {/* 펼치기 삼각형 */}
          <button
            type="button"
            aria-label={open ? '접기' : '펼치기'}
            onClick={() => setPinned((p) => !p)}
            className="p-1 -mr-1 rounded hover:bg-gray-100 transition"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              className={`transition-transform duration-200 ${
                open ? 'rotate-180' : ''
              }`}
            >
              <path d="M7 10l5 5 5-5z" fill={color} />
            </svg>
          </button>
        </div>
      </div>

      {/* 상세 정보 */}
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
          open ? 'max-h-[700px] opacity-100' : 'max-h-0 opacity-0'
        } px-6 pb-4`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 items-start">
          {/* 멤버 */}
          <section>
            <h4 className="text-sm font-semibold text-gray-600 mb-2">멤버</h4>
            <div className="flex items-center gap-6">
              {(members || []).slice(0, 8).map((m, i) => {
                const displayName = m?.user?.name ?? m?.name ?? `멤버${i + 1}`;
                return (
                  <div key={i} className="text-center">
                    <div className="w-10 h-10 rounded-full bg-gray-300" />
                    <div className="text-xs text-gray-600 mt-1">{displayName}</div>
                  </div>
                );
              })}
              {(members || []).length === 0 && (
                <div className="text-xs text-gray-400">멤버가 없습니다</div>
              )}
            </div>
          </section>

          {/* 크루 일정  */}
          <section className="md:row-span-2 self-start">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">
              크루 일정
            </h4>
            <CalendarBox 
              inline 
              mode="mini" 
              accent={color} 
              events={crewEvents}
              onDateClick={(date, dayEvents) => {
                if (dayEvents && dayEvents.length > 0) {
                  // 해당 날짜의 첫 번째 이벤트를 선택 (여러 개면 첫 번째만)
                  setSelectedEvent(dayEvents[0]);
                  setOpenEditModal(true);
                }
              }}
            />

            {/* 일정 생성/삭제 버튼 */}
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                className="rounded-full px-4 py-2 text-white shadow-sm"
                style={{ backgroundColor: color }}
                onClick={() => setOpenCreate(true)}
              >
                일정 생성
              </button>

             
            </div>
          </section>

          {/* 크루 활동  */}
          <section className="md:col-start-1">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">
              크루 활동
            </h4>

            <ActivityWidget
              accent={color}
              total={4}
              segments={[
                { label: '축구', count: 2 },
                { label: '러닝', count: 1 },
                { label: '농구', count: 1 },
              ]}
              gapClass="gap-2"
            />
          </section>
        </div>

        {/* 공유 / 탈퇴 */}
        <div className="flex gap-3 mt-5">
          <button
            className="flex-1 rounded-full text-white py-2"
            style={{ backgroundColor: color }}
            onClick={() => onShare?.(id)}
          >
            공유
          </button>
          <button
            className="flex-1 rounded-full text-white py-2"
            style={{ backgroundColor: color }}
            onClick={() => onLeave?.(id)}
          >
            탈퇴
          </button>
        </div>
      </div>

      {/* 일정 생성 모달 */}
      <CrewScheduleFormModal
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        title="새 일정 만들기"
        color={color}
        onSave={async (data) => {
          if (!id) return;
          
          try {
            // 활동 ID 찾기 (activities에서 activity 이름으로 찾기)
            const activityObj = activities.find((a) => a.name === data.activity);
            if (!activityObj) {
              alert('활동을 찾을 수 없습니다.');
              return;
            }
            const activityId = parseInt(activityObj.id, 10);
            
            if (!data.date) {
              alert('날짜를 선택해주세요.');
              return;
            }
            
            // 시간 문자열을 객체로 변환 (HH:mm 형식)
            const timeStr = data.time || '12:00';
            const [hour, minute] = timeStr.split(':').map(Number);
            
            if (isNaN(hour) || isNaN(minute)) {
              alert('시간 형식이 올바르지 않습니다.');
              return;
            }
            
            // Swagger 스펙에 맞는 요청 바디 형식
            const locId = data.locationId;
            const validLocationId = (typeof locId === 'number' && locId > 0) ? locId : null;
            
            // locationId가 유효하지 않으면 null로 설정 (백엔드에서 처리하도록)
            const schedulePayload = {
              activityId: activityId,
              date: data.date, // YYYY-MM-DD 형식
              time: {
                hour: hour,
                minute: minute,
                second: 0,
                nano: 0,
              },
              equipmentList: data.gear || '',
              locationId: validLocationId,
              locationAddress: data.place && data.place.trim() ? data.place.trim() : null,
              locationLatitude: data.locationLatitude || null,
              locationLongitude: data.locationLongitude || null,
            };
            
            console.log('일정 생성 요청:', JSON.stringify(schedulePayload, null, 2));
            const created = await addCrewSchedule(id, schedulePayload);
            
            if (created) {
              // 일정 생성 모달 닫기
              setOpenCreate(false);
              // 저장된 이벤트 데이터 저장 (확인 모달용)
              setSavedEventData(data);
              // 캘린더 추가 확인 모달 열기
              setOpenCalendarModal(true);
              // 일정 목록 새로고침
              await loadCrewSchedules(id, currentYear, currentMonth);
            } else {
              alert('일정 생성에 실패했습니다.');
            }
          } catch (error) {
            console.error('일정 생성 오류:', error);
            console.error('에러 응답:', error?.response?.data);
            const errorMessage = error?.response?.data?.message || error?.message || '알 수 없는 오류';
            alert(`일정 생성 중 오류가 발생했습니다: ${errorMessage}`);
          }
        }}
      />

      {/* 일정 수정/삭제 모달 */}
      <CrewScheduleFormModal
        isOpen={openEditModal}
        onClose={() => {
          setOpenEditModal(false);
          setSelectedEvent(null);
        }}
        title="일정 수정"
        color={color}
        initialData={selectedEvent}
        showDelete={true}
        onSave={async (data) => {
          if (!id || !selectedEvent?.crewScheduleId) return;
          
          try {
            // 일정 수정은 현재 API에 없으므로 삭제 후 재생성
            // TODO: 일정 수정 API가 추가되면 수정 API 호출로 변경
            await removeCrewSchedule(id, selectedEvent.crewScheduleId);
            
            // 활동 ID 찾기
            const activityObj = activities.find((a) => a.name === data.activity);
            const activityId = activityObj ? parseInt(activityObj.id, 10) : 0;
            
            // 시간 문자열을 객체로 변환
            const timeStr = data.time || '12:00';
            const [hour, minute] = timeStr.split(':').map(Number);
            
            // Swagger 스펙에 맞는 요청 바디 형식
            const schedulePayload = {
              activityId: activityId,
              date: data.date,
              time: {
                hour: hour,
                minute: minute,
                second: 0,
                nano: 0,
              },
              equipmentList: data.gear || '',
              locationId: 0,
              locationAddress: data.place && data.place.trim() ? data.place.trim() : '',
              locationLatitude: 0.0,
              locationLongitude: 0.0,
            };
            
            await addCrewSchedule(id, schedulePayload);
            await loadCrewSchedules(id, currentYear, currentMonth);
            
            setOpenEditModal(false);
            setSelectedEvent(null);
          } catch (error) {
            console.error('일정 수정 오류:', error);
            const errorMessage = error?.response?.data?.message || error?.message || '알 수 없는 오류';
            alert(`일정 수정 중 오류가 발생했습니다: ${errorMessage}`);
          }
        }}
        onDelete={async () => {
          if (!id || !selectedEvent?.crewScheduleId) return;
          
          try {
            await removeCrewSchedule(id, selectedEvent.crewScheduleId);
            await loadCrewSchedules(id, currentYear, currentMonth);
            setOpenEditModal(false);
            setSelectedEvent(null);
          } catch (error) {
            console.error('일정 삭제 오류:', error);
            alert('일정 삭제 중 오류가 발생했습니다.');
          }
        }}
      />

      {/* 캘린더 추가 확인 모달 */}
      <CalendarAddedModal
        isOpen={openCalendarModal}
        onClose={() => {
          setOpenCalendarModal(false);
          setSavedEventData(null);
        }}
        dateYmd={savedEventData?.date || ''}
        locationName={savedEventData?.place || '장소 미지정'}
        activityLabel={savedEventData?.activity || ''}
      />
    </div>
  );
}
  