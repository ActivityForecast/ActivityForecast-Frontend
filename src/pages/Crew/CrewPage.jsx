import { useEffect, useState, useMemo } from "react";
import Button from "components/Button";
import CalendarBox from "mocks/Calender";
import CrewListItem from "mocks/CrewListItem";
import Modal, { ModalFooter } from "components/Modal/Modal";
import InputField from "components/InputField";
import { useAuthStore } from 'stores/auth';
import { useCrewStore } from 'stores/crew';
import CrewScheduleFormModal from 'components/CrewScheduleFormModal';
import activities from 'constants/activities';

export default function CrewPage() {
  const { user } = useAuthStore();
  const { myCrews, loadMyCrews, addCrew, removeMember, loadAllCrewSchedules, addCrewSchedule } = useCrewStore();
  
  // 전체 크루 일정 상태
  const [allCrewSchedules, setAllCrewSchedules] = useState([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [openScheduleModal, setOpenScheduleModal] = useState(false);
  const [openEventListModal, setOpenEventListModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCrewForSchedule, setSelectedCrewForSchedule] = useState(null);
  
  // 현재 년/월 계산
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;


  // 서버에서 크루 목록 로드
  useEffect(() => {
    if (user) {
      loadMyCrews();
    }
  }, [user, loadMyCrews]);

  // 전체 크루 일정 로드
  useEffect(() => {
    if (user) {
      loadAllCrewSchedules(currentYear, currentMonth).then((schedules) => {
        setAllCrewSchedules(schedules || []);
      });
    }
  }, [user, currentYear, currentMonth, loadAllCrewSchedules]);

  // API 응답 필드가 달라도 안전하게 매핑
  const safeCrews = (myCrews || []).map((c) => ({
    id: c.crewId ?? c.id,
    name: c.crewName ?? c.name ?? '크루',
    current: c.activeMemberCount ?? (Array.isArray(c.members) ? c.members.length : 0) ?? 1,
    max: c.maxCapacity ?? c.max ?? 10,
    color: c.colorCode ?? c.color ?? "#83C8FC",
    inviteCode: c.inviteCode,
    members: Array.isArray(c.members) ? c.members : [],
  }));

  // 파스텔톤 색상 팔레트
  const colorPalette = [
    "#FC8385",
    "#FCA883",
    "#FCD083",
    "#A4E682",
    "#7FECC8",
    "#83C8FC",
    "#A6A4FC",
    "#E6A4FC",
    "#FC83C6",
    "#FCE683",
  ];

  // 랜덤 색상 선택
  const getRandomColor = () => {
    return colorPalette[Math.floor(Math.random() * colorPalette.length)];
  };

  //  생성 모달
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [crewName, setCrewName] = useState("");
  const [crewMax, setCrewMax] = useState("");

  //  탈퇴 완료 모달
  const [leaveTargetId, setLeaveTargetId] = useState(null);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);

  //  공유 모달
  const [shareOpen, setShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const handleShare = async (crew) => {
    const code = crew.inviteCode;
    if (!code) return;
    const url = `${window.location.origin}/crew/join?code=${encodeURIComponent(code)}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch (_) {}
    setShareUrl(url);
    setShareOpen(true);
  };

  // 캘린더 이벤트를 CalendarBox 형식으로 변환
  const calendarEvents = useMemo(() => {
    return (allCrewSchedules || []).map((schedule) => {
      const scheduleDate = schedule.scheduleDate || schedule.date;
      const dateStr = scheduleDate ? (typeof scheduleDate === 'string' ? scheduleDate.split('T')[0] : scheduleDate) : '';
      return {
        date: dateStr,
        label: schedule.activity || schedule.activityName || '활동',
        activity: schedule.activity || schedule.activityName,
        place: schedule.locationAddress || schedule.place,
        time: schedule.time || schedule.startTime,
        gear: schedule.equipmentList || schedule.gear,
        crewScheduleId: schedule.crewScheduleId || schedule.id,
        crewId: schedule.crewId,
        crewName: safeCrews.find(c => c.id === schedule.crewId)?.name || '크루',
        crewColor: safeCrews.find(c => c.id === schedule.crewId)?.color || '#83C8FC',
      };
    });
  }, [allCrewSchedules, safeCrews]);

  // 날짜 클릭 핸들러
  const handleDateClick = (date, dayEvents) => {
    if (dayEvents && dayEvents.length > 0) {
      setSelectedDateEvents(dayEvents);
      setSelectedDate(date);
      setOpenEventListModal(true);
    } else {
      // 일정이 없는 날짜 클릭 시 일정 생성 모달 열기 (크루 선택 필요)
      setSelectedDate(date);
      setOpenScheduleModal(true);
    }
  };

  // 일정 생성 핸들러
  const handleCreateSchedule = async (data, crewId) => {
    if (!crewId) {
      alert('크루를 선택해주세요.');
      return;
    }

    try {
      // 활동 ID 찾기
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

      // 시간 문자열을 객체로 변환
      const timeStr = data.time || '12:00';
      const [hour, minute] = timeStr.split(':').map(Number);

      if (isNaN(hour) || isNaN(minute)) {
        alert('시간 형식이 올바르지 않습니다.');
        return;
      }

      // locationId가 유효하지 않으면 null로 설정
      const locId = data.locationId;
      const validLocationId = (typeof locId === 'number' && locId > 0) ? locId : null;
      
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
        locationId: validLocationId,
        locationAddress: data.place && data.place.trim() ? data.place.trim() : null,
        locationLatitude: data.locationLatitude || null,
        locationLongitude: data.locationLongitude || null,
      };

      const created = await addCrewSchedule(crewId, schedulePayload);
      if (created) {
        // 일정 목록 새로고침
        const schedules = await loadAllCrewSchedules(currentYear, currentMonth);
        setAllCrewSchedules(schedules || []);
        setOpenScheduleModal(false);
        setSelectedCrewForSchedule(null);
        setSelectedDate(null);
      } else {
        alert('일정 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('일정 생성 오류:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '알 수 없는 오류';
      alert(`일정 생성 중 오류가 발생했습니다: ${errorMessage}`);
    }
  };


  // 크루 생성 로직
  const handleCreateCrew = async () => {
    if (!crewName.trim() || !crewMax.trim()) return;
    try {
      const cap = Math.max(1, Math.min(50, parseInt(crewMax, 10) || 1));
      const randomColor = getRandomColor();
      await addCrew({
        crewName: crewName,
        maxCapacity: cap,
        colorCode: randomColor,
      });
      setCrewName("");
      setCrewMax("");
      setIsModalOpen(false);
    } catch (error) {
      console.error('크루 생성 실패:', error);
    }
  };

  // CrewListItem에서 탈퇴 클릭 시 → 완료 모달 띄우기
  const handleLeaveRequest = (id) => {
    setLeaveTargetId(id);
    setLeaveModalOpen(true);
  };

  //  완료 클릭 시 실제 삭제
  const handleLeaveConfirm = async () => {
    if (leaveTargetId == null) return;
    const targetUserId = user?.userId ?? user?.id;
    if (!targetUserId) {
      // 사용자 ID를 확인할 수 없으면 일단 모달만 닫고 종료
      setLeaveTargetId(null);
      setLeaveModalOpen(false);
      return;
    }

    try {
      const success = await removeMember(leaveTargetId, targetUserId);
      if (success) {
        // 탈퇴 성공 시 목록 새로고침
        await loadMyCrews();
      }
    } catch (error) {
      console.error('크루 탈퇴 실패:', error);
    } finally {
      setLeaveTargetId(null);
      setLeaveModalOpen(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center relative">
      <div
        className="
          w-[90vw] max-w-[952px]
          min-h-[90vh]
          border border-[rgba(0,0,0,0.09)]
          rounded-[30px]
          bg-[#F8FAFC]
          shadow-sm
          flex flex-col items-center
          justify-start
          pt-12 px-10 pb-10
          overflow-hidden
        "
      >
        {/*  상단 버튼 */}
        <div className="w-full flex justify-center">
          <Button
            type="button"
            styleType="solid"
            size="py-3.5 w-[200px] text-md"
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-[50px] shadow-md transition-all duration-200"
            onClick={() => setIsModalOpen(true)}
          >
            크루 생성 +
          </Button>
        </div>

        {/* 크루 목록 */}
        <h2 className="w-full text-2xl font-semibold text-black mt-20 text-left ml-10 md:ml-20 lg:ml-40">
          크루목록
        </h2>

        <div className="w-full mt-4 px-6">
          {!user ? (
            <div className="rounded-2xl border border-gray-200 bg-white py-14 px-6 text-center text-gray-400">
              <div className="text-base sm:text-lg">
                사용자가 참여하고 있는 크루가 없습니다
              </div>
              <div className="mt-2 text-xs sm:text-sm text-gray-400">
                크루를 생성하여 다른 사람과 함께 운동해요
              </div>
            </div>
          ) : (
            <div className="space-y-3">

              {safeCrews.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-white py-14 px-6 text-center text-gray-400">
                  <div className="text-base sm:text-lg">
                    참여 중인 크루가 없습니다
                  </div>
                  <div className="mt-2 text-xs sm:text-sm text-gray-400">
                    크루를 생성하여 다른 사람과 함께 운동해요
                  </div>
                </div>
              ) : (
                safeCrews.map((c) => (
                  <CrewListItem
                    key={c.id}
                    id={c.id}
                    name={c.name}
                    current={c.current}
                    max={c.max}
                    color={c.color}
                    members={c.members}
                    onLeave={handleLeaveRequest}
                    onShare={() => handleShare(c)}
                  />
                ))
              )}

            </div>
          )}
        </div>

        {/* 캘린더 */}
        <h3 className="w-full text-2xl font-semibold text-black mt-10 text-center">
          캘린더
        </h3>
        <div className="mt-6 flex justify-center">
          {/* 이 캘린더만 X축 더 넓게 */}
          <CalendarBox 
            inline 
            size="xl" 
            wide 
            events={calendarEvents}
            onDateClick={handleDateClick}
          />
        </div>
      </div>

      {/* 모달 (크루 생성) - 가로폭 작게 */}
      <div style={{ '--modal-w-sm': '640px' }}>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="크루 생성하기"
      >
        <div className="flex flex-col gap-4 mt-4">
          <label className="font-semibold text-lg text-black">크루명</label>
          <InputField
            id="crewName"
            type="text"
            placeholder="크루명을 입력하세요"
            value={crewName}
            onChange={(e) => setCrewName(e.target.value)}
          />

          <label className="font-semibold text-lg text-black mt-2">인원</label>
          <InputField
            id="crewMax"
            type="number"
            placeholder="인원(최대 50)"
            min={1}
            max={50}
            value={crewMax}
            onChange={(e) => setCrewMax(e.target.value)}
          />

          <ModalFooter>
            <Button
              type="button"
              styleType="solid"
              onClick={handleCreateCrew}
              className="bg-[#3B82F6] text-white rounded-xl mt-4"
            >
              생성하기
            </Button>
          </ModalFooter>
        </div>
      </Modal>
      </div>

      {/*  탈퇴 완료 모달 - 더 작게 */}
      <div style={{ '--modal-w-sm': '520px' }}>
      <Modal
        isOpen={leaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
        hasCloseButton={false}
        isCloseOutsideClick={true}
        title=""
      >
        <div className="text-center text-lg font-semibold py-6">
          탈퇴가 완료되었습니다
        </div>
        <ModalFooter>
          <button
            onClick={handleLeaveConfirm}
            className="flex-1 rounded-xl bg-[#4FBFF2] text-white py-3"
          >
            완료
          </button>
        </ModalFooter>
      </Modal>
      </div>

      {/* 공유 완료 모달 */}
      <div style={{ '--modal-w-sm': '520px' }}>
      <Modal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        hasCloseButton={false}
        isCloseOutsideClick={true}
        title=""
      >
        <div className="text-center py-6">
          <div className="text-lg font-semibold">공유를 위한 링크가 복사되었습니다!</div>
          <div className="mt-3 text-xs sm:text-sm text-gray-400 break-all">{shareUrl || 'http://…'}</div>
        </div>
        <ModalFooter>
          <button
            onClick={() => setShareOpen(false)}
            className="flex-1 rounded-xl bg-[#4FBFF2] text-white py-3"
          >
            완료
          </button>
        </ModalFooter>
      </Modal>
      </div>

      {/* 일정 목록 모달 (날짜 클릭 시) */}
      <Modal
        isOpen={openEventListModal}
        onClose={() => {
          setOpenEventListModal(false);
          setSelectedDateEvents([]);
          setSelectedDate(null);
        }}
        title={selectedDate ? `${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일 일정` : '일정'}
      >
        <div className="mt-4 max-h-96 overflow-y-auto">
          {selectedDateEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-400">해당 날짜에 일정이 없습니다.</div>
          ) : (
            <div className="space-y-3">
              {selectedDateEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-gray-200"
                  style={{ borderLeftColor: event.crewColor, borderLeftWidth: '4px' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-xs px-2 py-1 rounded-full text-white font-semibold"
                      style={{ backgroundColor: event.crewColor }}
                    >
                      {event.crewName}
                    </span>
                    <span className="text-sm text-gray-500">{event.time || '시간 미지정'}</span>
                  </div>
                  <div className="font-semibold text-lg text-black">{event.activity || event.label}</div>
                  {event.place && (
                    <div className="text-sm text-gray-600 mt-1">📍 {event.place}</div>
                  )}
                  {event.gear && (
                    <div className="text-sm text-gray-500 mt-1">🎒 {event.gear}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <ModalFooter>
          <button
            onClick={() => {
              setOpenEventListModal(false);
              setSelectedDateEvents([]);
              setSelectedDate(null);
            }}
            className="flex-1 rounded-xl bg-[#4FBFF2] text-white py-3"
          >
            닫기
          </button>
        </ModalFooter>
      </Modal>

      {/* 일정 생성 모달 (크루 선택 포함) */}
      <Modal
        isOpen={openScheduleModal}
        onClose={() => {
          setOpenScheduleModal(false);
          setSelectedCrewForSchedule(null);
          setSelectedDate(null);
        }}
        title="새 일정 만들기"
      >
        <div className="mt-4 space-y-4">
          {/* 크루 선택 */}
          <div>
            <label className="font-semibold text-black block mb-2">크루 선택</label>
            <select
              value={selectedCrewForSchedule?.id || ''}
              onChange={(e) => {
                const crewId = parseInt(e.target.value, 10);
                const crew = safeCrews.find(c => c.id === crewId);
                setSelectedCrewForSchedule(crew || null);
              }}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black bg-white"
            >
              <option value="">크루를 선택하세요</option>
              {safeCrews.map((crew) => (
                <option key={crew.id} value={crew.id}>
                  {crew.name}
                </option>
              ))}
            </select>
          </div>

          {/* 일정 생성 폼 */}
          {selectedCrewForSchedule && (
            <CrewScheduleFormModal
              isOpen={true}
              onClose={() => {
                setOpenScheduleModal(false);
                setSelectedCrewForSchedule(null);
                setSelectedDate(null);
              }}
              title=""
              color={selectedCrewForSchedule.color}
              initialData={selectedDate ? { date: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}` } : null}
              onSave={(data) => {
                handleCreateSchedule(data, selectedCrewForSchedule.id);
              }}
              showDelete={false}
            />
          )}
        </div>
      </Modal>
    </main>
  );
}
