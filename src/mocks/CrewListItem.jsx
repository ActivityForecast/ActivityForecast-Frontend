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
  const {
    schedulesByCrewId,
    statisticsByCrewId,
    loadCrewSchedules,
    loadCrewStatistics,
    addCrewSchedule,
    removeCrewSchedule,
    updateCrewSchedule,
  } = useCrewStore();

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

  // 크루 활동 통계 불러오기
  useEffect(() => {
    if (id) {
      loadCrewStatistics(id);
    }
  }, [id, loadCrewStatistics]);

  // 활동명 로컬 복원 헬퍼
  const storageKey = `crewActivityMap:${id}`;
  const readActivityMap = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };
  const writeActivityMap = (map) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(map));
    } catch {}
  };
  const normalizeDateStr = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value.split('T')[0];
    try {
      return new Date(value).toISOString().split('T')[0];
    } catch {
      return '';
    }
  };
  const normalizeTimeStr = (value) => {
    if (!value) return '';
    if (typeof value === 'string') {
      const hhmm = value.includes(':') ? value.slice(0, 5) : value;
      return /^\d{2}:\d{2}$/.test(hhmm) ? hhmm : '';
    }
    return '';
  };
  const makeCompositeKey = (dateYmd, timeHmm, placeName) =>
    `d:${dateYmd}|t:${timeHmm}|p:${(placeName || '').trim()}`;
  const getActivityFromLocal = (
    crewScheduleId,
    dateYmd,
    timeHmm,
    placeName
  ) => {
    const map = readActivityMap();
    if (crewScheduleId && map[`id:${crewScheduleId}`])
      return map[`id:${crewScheduleId}`];
    const comp = makeCompositeKey(dateYmd, timeHmm, placeName);
    return map[comp];
  };
  const saveActivityToLocal = (
    crewScheduleId,
    dateYmd,
    timeHmm,
    placeName,
    name,
    activityId
  ) => {
    if (!name) return;
    const map = readActivityMap();
    const payload = { name, id: activityId };
    if (crewScheduleId) map[`id:${crewScheduleId}`] = payload;
    const comp = makeCompositeKey(dateYmd, timeHmm, placeName);
    map[comp] = payload;
    writeActivityMap(map);
  };

  // API 일정을 CalendarBox 형식으로 변환
  const apiSchedules = schedulesByCrewId[id] || [];
  const crewEvents = apiSchedules.map((schedule) => {
    // 활동 이름 정규화: name → nameId 매핑까지 시도
    const activityNameFromId = (() => {
      const id =
        schedule.activityId ||
        (schedule.activity &&
          (schedule.activity.id || schedule.activity.activityId)) ||
        schedule.activityID ||
        schedule.activity_id;
      if (!id) return undefined;
      const found = activities.find((a) => Number(a.id) === Number(id));
      return found?.name;
    })();

    // 편집용 활동명(항상 문자열)
    const activityText =
      (typeof schedule.activity === 'string' && schedule.activity) ||
      (schedule.activity &&
        typeof schedule.activity.name === 'string' &&
        schedule.activity.name) ||
      (typeof schedule.activityName === 'string' && schedule.activityName) ||
      (typeof schedule.activityLabel === 'string' && schedule.activityLabel) ||
      (typeof schedule.activity_label === 'string' &&
        schedule.activity_label) ||
      (typeof schedule.activityKorName === 'string' &&
        schedule.activityKorName) ||
      (typeof schedule.activityNameKo === 'string' &&
        schedule.activityNameKo) ||
      (typeof schedule.activityKorean === 'string' &&
        schedule.activityKorean) ||
      activityNameFromId ||
      '';

    // scheduleDate에서 시간 추출(HH:mm)
    const timeFromScheduleDate = (() => {
      const sd =
        schedule.scheduleDate || schedule.dateTime || schedule.datetime;
      if (typeof sd === 'string' && sd.includes('T')) {
        const hhmm = sd.split('T')[1]?.slice(0, 5);
        return hhmm && /^\d{2}:\d{2}$/.test(hhmm) ? hhmm : undefined;
      }
      return undefined;
    })();

    // 최근 저장한 데이터로 보정(서버가 활동명을 안 줄 때)
    let fallbackNameFromSaved = '';
    if (!activityText && savedEventData) {
      const schedDateStr = (() => {
        const raw =
          schedule.date || schedule.scheduleDate || schedule.startDate;
        if (!raw) return '';
        return typeof raw === 'string'
          ? raw.split('T')[0]
          : new Date(raw).toISOString().split('T')[0];
      })();
      const savedDateStr = savedEventData.date
        ? String(savedEventData.date).split('T')[0]
        : '';
      const schedTimeStr = (
        schedule.time ||
        schedule.startTime ||
        timeFromScheduleDate ||
        ''
      ).slice(0, 5);
      const savedTimeStr = (savedEventData.time || '').slice(0, 5);
      const schedPlace = (
        schedule.locationAddress ||
        schedule.place ||
        schedule.location ||
        ''
      ).trim();
      const savedPlace = (savedEventData.place || '').trim();
      if (
        schedDateStr &&
        schedTimeStr &&
        savedDateStr === schedDateStr &&
        savedTimeStr === schedTimeStr &&
        savedPlace === schedPlace
      ) {
        fallbackNameFromSaved = savedEventData.activity || '';
      }
    }

    // 로컬 저장소 기반 보정(과거 일정 복원)
    let fallbackFromLocal = '';
    let fallbackIdFromLocal = undefined;
    const schedDateStr2 = normalizeDateStr(
      schedule.date || schedule.scheduleDate || schedule.startDate
    );
    const schedTimeStr2 = normalizeTimeStr(
      schedule.time || schedule.startTime || timeFromScheduleDate || ''
    );
    const schedPlace2 = (
      schedule.locationAddress ||
      schedule.place ||
      schedule.location ||
      ''
    ).trim();
    const localHit = getActivityFromLocal(
      schedule.crewScheduleId ||
        schedule.id ||
        schedule.scheduleId ||
        schedule.schedule_id,
      schedDateStr2,
      schedTimeStr2,
      schedPlace2
    );
    if (!activityText && localHit) {
      fallbackFromLocal = localHit.name || '';
      fallbackIdFromLocal = localHit.id;
    }

    // 표시용 라벨(없으면 카드에 기본 문구)
    const displayLabel =
      activityText ||
      fallbackNameFromSaved ||
      (typeof schedule.label === 'string' ? schedule.label : '') ||
      '활동';

    return {
      date: schedule.date || schedule.scheduleDate || schedule.startDate,
      label: displayLabel,
      activity: activityText || fallbackNameFromSaved || fallbackFromLocal,
      activityId:
        schedule.activityId ||
        (schedule.activity &&
          (schedule.activity.id || schedule.activity.activityId)) ||
        schedule.activityID ||
        schedule.activity_id ||
        fallbackIdFromLocal,
      place: schedule.locationAddress || schedule.place || schedule.location,
      time: schedule.time || schedule.startTime || timeFromScheduleDate,
      gear: schedule.equipmentList || schedule.gear || schedule.equipment,
      crewScheduleId: schedule.crewScheduleId || schedule.id,
    };
  });

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
        } pl-8 pr-6 pb-4 md:pl-10`}
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
                    <div
                      className="w-10 h-10 rounded-md grid place-items-center border bg-transparent"
                      style={{ borderColor: color, borderWidth: 2 }}
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fill={color}
                          d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.97 0-9 1.49-9 4.5V21h18v-2.5C21 15.49 14.97 14 12 14z"
                        />
                      </svg>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {displayName}
                    </div>
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
                console.log('mini onDateClick', date, dayEvents?.[0]);
                if (dayEvents && dayEvents.length > 0) {
                  // 해당 날짜의 첫 번째 이벤트를 선택 (여러 개면 첫 번째만) + 값 정규화
                  const ev = dayEvents[0] || {};
                  // 활동 정보 보강: 이벤트에 비어있으면 원본 스케줄에서 재추출
                  let mergedActivity =
                    (typeof ev.activity === 'string' && ev.activity) || '';
                  let mergedActivityId = ev.activityId;
                  if (!mergedActivity || !mergedActivityId) {
                    const evKey =
                      ev.crewScheduleId ??
                      ev.id ??
                      ev.scheduleId ??
                      ev.schedule_id;
                    const original = apiSchedules.find((s) => {
                      const sid =
                        s.crewScheduleId ??
                        s.id ??
                        s.scheduleId ??
                        s.schedule_id;
                      return (
                        sid != null &&
                        evKey != null &&
                        String(sid) === String(evKey)
                      );
                    });
                    if (original) {
                      console.log(
                        '[onDateClick] found original schedule for',
                        evKey,
                        original
                      );
                      mergedActivityId =
                        mergedActivityId ||
                        original.activityId ||
                        (original.activity &&
                          (original.activity.id ||
                            original.activity.activityId)) ||
                        original.activityID ||
                        original.activity_id ||
                        original.activityType ||
                        original.activity_code ||
                        original.sportId ||
                        original.sportsId ||
                        original.categoryId;
                      mergedActivity =
                        mergedActivity ||
                        (typeof original.activity === 'string' &&
                          original.activity) ||
                        (original.activity &&
                          typeof original.activity.name === 'string' &&
                          original.activity.name) ||
                        (typeof original.activityName === 'string' &&
                          original.activityName) ||
                        (typeof original.activityLabel === 'string' &&
                          original.activityLabel) ||
                        '';
                    }
                  }
                  // 로컬 저장소 보강
                  if (!mergedActivity || !mergedActivityId) {
                    const normDate = ev.date
                      ? typeof ev.date === 'string'
                        ? ev.date.split('T')[0]
                        : new Date(ev.date).toISOString().split('T')[0]
                      : '';
                    const normTime = ev.time
                      ? typeof ev.time === 'string'
                        ? ev.time.slice(0, 5)
                        : ''
                      : '';
                    const local = getActivityFromLocal(
                      ev.crewScheduleId,
                      normDate,
                      normTime,
                      ev.place || ''
                    );
                    if (local) {
                      mergedActivity = mergedActivity || local.name || '';
                      mergedActivityId = mergedActivityId || local.id;
                    }
                  }
                  // id로 이름 매핑
                  const mappedFromId = mergedActivityId
                    ? activities.find(
                        (a) => Number(a.id) === Number(mergedActivityId)
                      )?.name
                    : undefined;
                  let finalActivityName =
                    mappedFromId ||
                    mergedActivity ||
                    (typeof ev.label === 'string' && ev.label !== '활동'
                      ? ev.label
                      : '');

                  // 마지막 보정: 직전에 생성/수정한 이벤트 데이터와 (날짜/시간/장소) 매칭되면 활동명 채우기
                  if (!finalActivityName && savedEventData) {
                    const sameDate =
                      !!(savedEventData.date && ev.date) &&
                      String(savedEventData.date).split('T')[0] ===
                        String(ev.date).split('T')[0];
                    const sameTime =
                      !!(savedEventData.time && ev.time) &&
                      String(savedEventData.time).slice(0, 5) ===
                        String(ev.time).slice(0, 5);
                    const samePlace =
                      (savedEventData.place || '').trim() ===
                      (ev.place || '').trim();
                    if (sameDate && sameTime && samePlace) {
                      finalActivityName = savedEventData.activity || '';
                      if (!mergedActivityId && finalActivityName) {
                        const m = activities.find(
                          (a) => a.name === finalActivityName
                        );
                        if (m) mergedActivityId = Number(m.id);
                      }
                    }
                  }
                  const normDate = ev.date
                    ? typeof ev.date === 'string'
                      ? ev.date.split('T')[0]
                      : new Date(ev.date).toISOString().split('T')[0]
                    : '';
                  const normTime = ev.time
                    ? typeof ev.time === 'string'
                      ? ev.time
                      : '12:00'
                    : '12:00';
                  setSelectedEvent({
                    activity: finalActivityName,
                    activityId: mergedActivityId,
                    place: ev.place || '',
                    date: normDate,
                    time: normTime,
                    gear: ev.gear || '',
                    crewScheduleId: ev.crewScheduleId,
                  });
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

            {(() => {
              const stats = statisticsByCrewId?.[id];
              // 유연한 매핑: 다양한 응답 형태 지원
              const items =
                (Array.isArray(stats?.activityCounts) &&
                  stats.activityCounts) ||
                (Array.isArray(stats?.activities) && stats.activities) ||
                (Array.isArray(stats?.topActivities) && stats.topActivities) ||
                (Array.isArray(stats) && stats) ||
                [];

              // 1) 이벤트 기반 집계(지나간 날짜만 포함)
              const toYmd = (val) => {
                if (!val) return '';
                if (typeof val === 'string')
                  return val.includes('T') ? val.split('T')[0] : val;
                try {
                  return new Date(val).toISOString().split('T')[0];
                } catch {
                  return '';
                }
              };
              const todayYmd = (() => {
                const t = new Date();
                const y = t.getFullYear();
                const m = String(t.getMonth() + 1).padStart(2, '0');
                const d = String(t.getDate()).padStart(2, '0');
                return `${y}-${m}-${d}`;
              })();
              const countsByNamePast = new Map();
              (crewEvents || []).forEach((ev) => {
                const evYmd = toYmd(ev.date);
                if (!evYmd || evYmd >= todayYmd) return; // 오늘 포함 미래 제외, "지난 날짜만"
                const nameFromId =
                  ev.activityId != null
                    ? activities.find(
                        (a) => String(a.id) === String(ev.activityId)
                      )?.name
                    : undefined;
                const label =
                  (typeof ev.activity === 'string' && ev.activity) ||
                  nameFromId ||
                  '';
                if (!label || label === '활동') return;
                countsByNamePast.set(
                  label,
                  (countsByNamePast.get(label) || 0) + 1
                );
              });
              let segments = Array.from(countsByNamePast.entries()).map(
                ([label, count]) => ({ label, count })
              );

              // 2) 이벤트가 없으면 통계 사용(백엔드 통계가 과거만 포함되어 있다고 가정)
              if (items.length > 0) {
                const mapped = items
                  .map((it) => {
                    const rawId =
                      it.activityId ??
                      it.id ??
                      (it.activity &&
                        (it.activity.id || it.activity.activityId));
                    const nameFromId =
                      rawId != null
                        ? activities.find((a) => String(a.id) === String(rawId))
                            ?.name
                        : undefined;
                    const label =
                      it.activityName ||
                      (it.activity && it.activity.name) ||
                      nameFromId ||
                      it.name ||
                      '활동';
                    const count = it.count ?? it.value ?? it.total ?? 0;
                    return { label, count };
                  })
                  .filter((s) => s.count > 0);
                if (segments.length === 0 && mapped.length > 0) {
                  segments = mapped;
                }
              } else if (stats && typeof stats === 'object') {
                // 객체 맵 형태: { "축구": 2, "러닝": 1 }
                const mappedObj = Object.entries(stats)
                  .filter(([k, v]) => typeof v === 'number' && v > 0)
                  .map(([k, v]) => ({ label: k, count: v }));
                if (segments.length === 0 && mappedObj.length > 0) {
                  segments = mappedObj;
                }
              }

              // 'total' 류의 총합 레이블 제거
              const isGeneric = (name) => {
                if (!name || typeof name !== 'string') return false;
                const n = name.toLowerCase().replace(/[\s_-]/g, '');
                // 예: total, totalActivity, totalActivityCount, total_count, 전체, 합계 등
                return (
                  n === 'total' ||
                  n === 'sum' ||
                  n === '전체' ||
                  n === '합계' ||
                  n.startsWith('total') ||
                  /total.*count/.test(n) ||
                  n.includes('totalactivity')
                );
              };
              segments = segments.filter((s) => !isGeneric(s.label));

              // 통계가 비어있거나 전부 총합만 있을 경우: 이미 위에서 이벤트 기반으로 segments가 채워짐

              const totalCount = segments.reduce(
                (a, b) => a + (b.count || 0),
                0
              );

              return (
                <ActivityWidget
                  accent={color}
                  total={totalCount}
                  segments={segments}
                  gapClass="gap-2"
                />
              );
            })()}
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
          if (!id) return alert('크루 정보를 찾을 수 없습니다.');
          // activityId 단순 매핑(이름 → 숫자 ID)
          const matched = activities.find((a) => a.name === data.activity);
          if (!matched) return alert('활동을 찾을 수 없습니다.');
          const activityId = Number(matched.id);
          if (!data?.date) return alert('날짜를 선택해주세요.');

          // 시간 파싱(HH:mm), 기본값 12:00
          const [h, m] = (data.time || '12:00').split(':').map(Number);
          if (Number.isNaN(h) || Number.isNaN(m))
            return alert('시간 형식이 올바르지 않습니다.');

          // Swagger RequestBody 최소 필드로 단순화
          const payload = {
            activityId,
            date: data.date, // YYYY-MM-DD
            time: `${String(h).padStart(2, '0')}:${String(m).padStart(
              2,
              '0'
            )}:00`, // HH:mm:ss
            equipmentList: data.gear || '',
            locationAddress: (data.place || '').trim(),
            locationLatitude: Number(data.locationLatitude) || 0,
            locationLongitude: Number(data.locationLongitude) || 0,
          };

          try {
            const created = await addCrewSchedule(id, payload);
            if (!created) return alert('일정 생성에 실패했습니다.');

            setOpenCreate(false);
            setSavedEventData(data);
            setOpenCalendarModal(true);
            await loadCrewSchedules(id, currentYear, currentMonth);

            // 로컬 복원 저장
            const createdId =
              created?.crewScheduleId || created?.id || created?.scheduleId;
            saveActivityToLocal(
              createdId,
              data.date,
              (data.time || '').slice(0, 5),
              (data.place || '').trim(),
              matched.name,
              activityId
            );
          } catch (e) {
            const msg =
              e?.response?.data?.message ||
              e?.response?.data?.error ||
              e?.message ||
              '일정 생성 중 오류가 발생했습니다.';
            alert(msg);
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
            // 활동 ID 찾기
            const activityObj = activities.find(
              (a) => a.name === data.activity
            );
            const activityId = activityObj ? parseInt(activityObj.id, 10) : 0;

            // 시간 문자열 정규화(HH:mm:ss)
            const timeStr = data.time || '12:00';
            const [hour, minute] = timeStr.split(':').map(Number);

            // Swagger 스펙에 맞는 요청 바디 형식
            const schedulePayload = {
              activityId: activityId,
              date: data.date, // YYYY-MM-DD
              time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(
                2,
                '0'
              )}:00`,
              equipmentList: data.gear || '',
              locationAddress:
                data.place && data.place.trim() ? data.place.trim() : '',
              locationLatitude: 0.0,
              locationLongitude: 0.0,
            };

            const updated = await updateCrewSchedule(
              id,
              selectedEvent.crewScheduleId,
              schedulePayload
            );
            await loadCrewSchedules(id, currentYear, currentMonth);

            setOpenEditModal(false);
            setSelectedEvent(null);

            // 로컬 복원 저장
            const newId =
              updated?.crewScheduleId || updated?.id || updated?.scheduleId;
            saveActivityToLocal(
              newId,
              data.date,
              (data.time || '').slice(0, 5),
              (data.place || '').trim(),
              activityObj?.name || data.activity,
              activityId || undefined
            );
          } catch (error) {
            console.error('일정 수정 오류:', error);
            const errorMessage =
              error?.response?.data?.message ||
              error?.message ||
              '알 수 없는 오류';
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
        }}
        dateYmd={savedEventData?.date || ''}
        locationName={savedEventData?.place || '장소 미지정'}
        activityLabel={savedEventData?.activity || ''}
      />
    </div>
  );
}
