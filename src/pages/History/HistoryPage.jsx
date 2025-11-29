import React, { useEffect, useMemo, useRef, useState } from 'react';
import Modal, { ModalFooter } from 'components/Modal/Modal';
import ActivityWidget from 'mocks/ActivityWidget';
import { useHistoryStore } from 'stores/history';
import activities from 'constants/activities';
import { getActivityImage } from 'constants/activityImages';
import { useAuthStore } from 'stores/auth';
import { useCrewStore } from 'stores/crew';
import { Feedback } from 'api/feedback';
import { useWeather } from 'hooks/useWeather';

export default function HistoryPage() {
  const now = useMemo(() => new Date(), []);
  const currentYear = now.getFullYear();

  // 개인 활동 통계 불러오기
  const { statsByYm, listByYm, loadMonthlyStats, loadMonthlyList, updateHistoryItem } = useHistoryStore();
  const { user } = useAuthStore();
  const { loadAllCrewSchedules } = useCrewStore();
  const [crewKeySet, setCrewKeySet] = useState(new Set());

  // 월 선택 상태
  const thisMonth = useMemo(() => new Date().getMonth() + 1, []);
  const [selectedMonth, setSelectedMonth] = useState(thisMonth);
  const [draftMonth, setDraftMonth] = useState(thisMonth);
  const [openMonthModal, setOpenMonthModal] = useState(false);
  const monthListRef = useRef(null);
  const scrollEndTimerRef = useRef(null);
  const monthItemHeight = 48;
  const [listSpacer, setListSpacer] = useState(64);

  const ymKey = useMemo(
    () => `${currentYear}-${String(selectedMonth).padStart(2, '0')}`,
    [currentYear, selectedMonth]
  );

  useEffect(() => {
    // 선택 월 변경 시 통계/목록 로딩
    loadMonthlyStats(currentYear, selectedMonth);
    loadMonthlyList(currentYear, selectedMonth);
  }, [currentYear, selectedMonth, loadMonthlyStats, loadMonthlyList]);

  // 크루 월간 일정 키 세트 생성(crew 일정은 히스토리에서 제외하기 위함)
  useEffect(() => {
    (async () => {
      try {
        const list = await loadAllCrewSchedules(currentYear, selectedMonth);
        const norm = (v) => (v == null ? '' : String(v).trim());
        const splitIso = (dt) => {
          if (!dt) return { ymd: '', time: '' };
          const s = String(dt);
          if (s.includes('T')) {
            const [d, t] = s.split('T');
            // strip possible milliseconds/timezone
            const hhmmss = (t || '').slice(0, 8);
            return { ymd: d, time: hhmmss };
          }
          return { ymd: s, time: '' };
        };
        const toKey = (it) => {
          const aid =
            it?.activityId ?? it?.activity?.id ?? it?.activity?.activityId ?? '';
          const rawDate =
            it?.date ?? it?.scheduleDate ?? it?.startDate ?? it?.day ?? '';
          const rawTime = it?.time ?? it?.scheduleTime ?? it?.startTime ?? '';
          const { ymd, time: timeFromIso } = splitIso(rawDate);
          const date = ymd || rawDate;
          const time = rawTime || timeFromIso || '';
          const loc =
            it?.locationAddress ?? it?.place ?? it?.location ?? '';
          return `${norm(aid)}|${norm(date)}|${norm(time)}|${norm(loc)}`;
        };
        const s = new Set();
        (Array.isArray(list) ? list : []).forEach((it) => {
          s.add(toKey(it));
        });
        setCrewKeySet(s);
      } catch {
        setCrewKeySet(new Set());
      }
    })();
  }, [loadAllCrewSchedules, currentYear, selectedMonth]);

  const stats = statsByYm?.[ymKey];
  const list = useMemo(() => listByYm?.[ymKey] || [], [listByYm, ymKey]);

  // 응답을 개인 기준으로 필터링: (1) 현재 사용자 식별자 매칭, (2) 크루 항목 제외
  const filteredList = useMemo(() => {
    const currentUserId =
      user?.id ?? user?.userId ?? user?.uid ?? user?.memberId ?? null;

    const norm = (v) => (v == null ? '' : String(v).trim());
    const historyKey = (it) => {
      const aid =
        it?.activityId ?? it?.activity?.id ?? it?.activity?.activityId ?? '';
      return `${norm(aid)}|${norm(it?.scheduleDate)}|${norm(it?.scheduleTime)}|${norm(it?.locationAddress)}`;
    };

    return (list || []).filter((it) => {
      // 1) 사용자 기준 필터 (응답에 userId가 있을 때만 적용)
      const itemUserId = it?.userId ?? it?.ownerId ?? it?.memberId ?? it?.user?.id;
      if (itemUserId != null && currentUserId != null) {
        if (String(itemUserId) !== String(currentUserId)) return false;
      }

      // 2) 크루에서 유입된 항목 제외 추정
      const hasCrewId =
        it?.crewId != null ||
        it?.crew?.id != null ||
        it?.crewScheduleId != null;
      const source = String(it?.source || it?.origin || '').toUpperCase();
      const isCrewSource = source.includes('CREW') || source.includes('GROUP');

      if (hasCrewId || isCrewSource) return false;

      // 3) 크루 일정 키셋과 일치하면 제외(액티비티/날짜/시간/장소 기준)
      const key = historyKey(it);
      if (crewKeySet.has(key)) return false;

      return true;
    });
  }, [list, user, crewKeySet]);

  // 활동 요약 세그먼트 매핑
  const segments = useMemo(() => {
    const countsObj =
      stats?.activityCounts ||
      stats?.activityCount ||
      stats?.counts ||
      {};

    const toLabel = (key) => {
      const found = activities.find((a) => String(a.id) === String(key));
      return found?.name || String(key);
    };

    const segs = Object.entries(countsObj).map(([k, v]) => ({
      label: toLabel(k),
      count: Number(v) || 0,
    }));

    // 총합/합계 류 제거
    const isGeneric = (name) => {
      if (!name || typeof name !== 'string') return false;
      const n = name.toLowerCase().replace(/[\s_-]/g, '');
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

    return segs.filter((s) => s.count > 0 && !isGeneric(s.label));
  }, [stats]);

  const total = useMemo(() => {
    if (typeof stats?.totalCompletedCount === 'number') {
      return stats.totalCompletedCount;
    }
    return segments.reduce((a, b) => a + (b.count || 0), 0);
  }, [stats, segments]);

  // 타임라인: 월별 히스토리 응답 매핑
  const timeline = useMemo(() => {
    // 1) 중복 제거: activityId + date + time + locationAddress 기준으로 최신 createdAt/큰 scheduleId 유지
    const map = new Map();
    const getKey = (it) => {
      const aid =
        it?.activityId ?? it?.activity?.id ?? it?.activity?.activityId ?? '';
      const d = it?.scheduleDate ?? '';
      const t = it?.scheduleTime ?? '';
      const loc = (it?.locationAddress || '').trim();
      return `${aid}|${d}|${t}|${loc}`;
    };
    const isNewer = (a, b) => {
      const aTime = new Date(a?.createdAt || 0).getTime();
      const bTime = new Date(b?.createdAt || 0).getTime();
      if (!Number.isNaN(aTime) && !Number.isNaN(bTime) && aTime !== bTime) {
        return aTime > bTime;
      }
      const aId = Number(a?.scheduleId ?? a?.id ?? -1);
      const bId = Number(b?.scheduleId ?? b?.id ?? -1);
      return aId > bId;
    };
    for (const it of filteredList) {
      const k = getKey(it);
      const prev = map.get(k);
      if (!prev || isNewer(it, prev)) map.set(k, it);
    }
    const deduped = Array.from(map.values());

    const toLabel = (it) => {
      if (it?.activity?.name) return it.activity.name;
      if (it?.activity?.activityName) return it.activity.activityName;
      if (it?.activityName) return it.activityName;
      const aid =
        it?.activityId ?? it?.activity?.id ?? it?.activity?.activityId;
      const found = activities.find((a) => String(a.id) === String(aid));
      return found?.name || '활동';
    };
    const fmtDate = (dStr) => {
      if (!dStr) return '';
      const d = new Date(dStr);
      if (Number.isNaN(d.getTime())) return dStr;
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const da = String(d.getDate()).padStart(2, '0');
      return `${y}년 ${parseInt(m, 10)}월 ${parseInt(da, 10)}일`;
    };
    return deduped.map((it) => {
      const title = toLabel(it);
      const category = it?.activity?.categoryName || it?.categoryName || '';
      const img = getActivityImage(title, category);
      return {
      id: it?.scheduleId ?? it?.id,
      title,
      date: fmtDate(it?.scheduleDate),
      done: !!(it?.isParticipated ?? it?.done),
      rating: typeof it?.rating === 'number' ? it.rating : (it?.rating ? Number(it.rating) : undefined),
      img,
      difficulty:
        it?.activity?.difficulty ||
        it?.activity?.difficultyLevel ||
        it?.difficulty ||
        '',
      locationAddress: it?.locationAddress || '',
      raw: it,
    };
    });
  }, [filteredList]);

  const monthLabel = `${selectedMonth}월 타임라인`;
  const displayedTimeline = useMemo(
    () => timeline, 
    [timeline]
  );

  useEffect(() => {
    if (!openMonthModal) return;
    const el = monthListRef.current;
    if (!el) return;

    const spacer = Math.max(
      0,
      Math.round(el.clientHeight / 2 - monthItemHeight / 2)
    );
    setListSpacer(spacer);

    const top = (draftMonth - 1) * monthItemHeight;
    el.scrollTo({ top, behavior: 'auto' });
  }, [openMonthModal, draftMonth]);

  const isAutoSnappingRef = useRef(false);
  const scrollToMonth = (m, behavior = 'smooth') => {
    const el = monthListRef.current;
    if (!el) return;
    const targetTop = (m - 1) * monthItemHeight;
    isAutoSnappingRef.current = true;
    el.scrollTo({ top: targetTop, behavior });
    setTimeout(
      () => {
        isAutoSnappingRef.current = false;
      },
      behavior === 'smooth' ? 260 : 0
    );
  };
  const handleMonthScroll = () => {
    const el = monthListRef.current;
    if (!el || isAutoSnappingRef.current) return;

    if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
    scrollEndTimerRef.current = setTimeout(() => {
      const idx = Math.round(el.scrollTop / monthItemHeight);
      const closest = Math.min(12, Math.max(0, idx)) + 1; // 1..12

      setDraftMonth(closest);
      scrollToMonth(closest, 'smooth');
    }, 200);
  };
  // 상세 모달 상태
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [localParticipated, setLocalParticipated] = useState(false);
  const [localRating, setLocalRating] = useState(5);
  const [viewportWidthPx, setViewportWidthPx] = useState(null);
  const openDetail = (item) => {
    setDetailItem(item);
    setLocalParticipated(!!(item?.done));
    setLocalRating(
      typeof item?.rating === 'number' ? item.rating : Number(item?.rating) || 5
    );
    setDetailOpen(true);
  };
  const closeDetail = () => setDetailOpen(false);

  // 날씨 아이콘 계산(상단 우측 아이콘)
  const wxYmd = detailItem?.raw?.scheduleDate || '';
  const wxTime = detailItem?.raw?.scheduleTime || '';
  const { data: wxData } = useWeather(wxYmd, wxTime);
  const weatherEmoji = (() => {
    const code = String(wxData?.icon || '').slice(0, 2);
    switch (code) {
      case '01':
        return '☀️';
      case '02':
        return '🌤️';
      case '03':
      case '04':
        return '☁️';
      case '09':
      case '10':
        return '🌧️';
      case '11':
        return '⛈️';
      case '13':
        return '❄️';
      case '50':
        return '🌫️';
      default:
        // 로딩/미확정 시 기본 아이콘을 비워 플리커 제거
        return '';
    }
  })();

  // 상세 모달 표시용 파생 값들
  const difficultyLabel = useMemo(() => {
    const v =
      detailItem?.difficulty ??
      detailItem?.raw?.activity?.difficultyLevel ??
      detailItem?.raw?.difficulty;
    const n = Number(v);
    if (Number.isNaN(n)) return v || '';
    if (n >= 5) return '매우 높음';
    if (n === 4) return '높음';
    if (n === 3) return '중';
    if (n === 2) return '낮음';
    return '매우 낮음';
  }, [detailItem]);

  const canRate = useMemo(() => {
    try {
      const ymd = detailItem?.raw?.scheduleDate || '';
      const t = detailItem?.raw?.scheduleTime || '23:59:59';
      if (!ymd) return true;
      const dt = new Date(`${ymd}T${t}`);
      if (Number.isNaN(dt.getTime())) return true;
      return new Date() >= dt;
    } catch {
      return true;
    }
  }, [detailItem]);

  const scrollRef = useRef(null);
  const scrollByCards = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const firstCard = el.querySelector('[data-card="true"]');
    const styles = window.getComputedStyle(el);
    const gap = parseInt(styles.columnGap || styles.gap || '16', 10) || 16;
    const cardW = (firstCard?.offsetWidth || 240) + gap;
    const amount = cardW * (dir === 'left' ? -1 : 1);
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  // 뷰포트 폭을 "카드 3장 + 간격 2개"로 고정
  useEffect(() => {
    const updateViewport = () => {
      const el = scrollRef.current;
      if (!el) return;
      const firstCard = el.querySelector('[data-card="true"]');
      if (!firstCard) return;
      const styles = window.getComputedStyle(el);
      const gap = parseInt(styles.columnGap || styles.gap || '18', 10) || 18;
      const cardW = firstCard.offsetWidth;
      const isSmUp = window.matchMedia && window.matchMedia('(min-width: 640px)').matches;
      if (isSmUp) {
        const desired = cardW * 3 + gap * 2; // 3 cards visible (sm 이상)
        setViewportWidthPx(desired);
      } else {
        // 모바일에서는 가로폭을 고정하지 않고 컨테이너에 맞춤
        setViewportWidthPx(null);
      }
    };
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, [displayedTimeline.length, selectedMonth]);

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center relative pt-16 sm:pt-24 pb-12">
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
          pt-10 sm:pt-14 px-5 sm:px-12 pb-10 sm:pb-12
        "
      >
        <h1 className="text-center text-2xl sm:text-3xl font-bold">히스토리</h1>

        {/* 활동요약 */}
        <section className="w-full mt-10 min-h-[320px]">
          <div className="rounded-3xl bg-[#F8FAFC]  px-4 py-10 sm:px-6 sm:py-12 md:px-8 md:py-14">
            <h2 className="text-base font-semibold  mb-3">활동요약</h2>
            <div className="rounded-2xl shadow-md overflow-visible">
              <ActivityWidget
                accent="#3B82F6"
                total={total}
                segments={segments}
                withBorder={false}
                gapClass="gap-6 sm:gap-10 md:gap-20"
                svgClassName="w-[120px] sm:w-[140px]"
              />
            </div>
          </div>
        </section>

        {/* 타임라인 */}
        <section className="w-full mt-10">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-base font-semibold">타임라인</h2>
          </div>

          <div className="relative rounded-3xl bg-white shadow-sm px-4 sm:px-6 py-5 sm:py-6">
            <div className="text-center text-lg font-semibold mb-6">
              {monthLabel}
              <button
                type="button"
                className="ml-2 align-middle text-xl"
                onClick={() => {
                  setDraftMonth(selectedMonth);
                  setOpenMonthModal(true);
                }}
              >
                📅
              </button>
            </div>
            {/* 좌우 버튼 */}
            <button
              type="button"
              aria-label="이전"
              onClick={() => scrollByCards('left')}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-0 text-2xl text-black hidden sm:inline-flex bg-transparent"
            >
              ◀
            </button>
            <button
              type="button"
              aria-label="다음"
              onClick={() => scrollByCards('right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-0 text-2xl text-black hidden sm:inline-flex bg-transparent"
            >
              ▶
            </button>

            {/* 스크롤 리스트 */}
            <div
              ref={scrollRef}
              className="timeline-scroll no-scrollbar flex gap-[18px] overflow-x-auto pl-0 pr-10 sm:pl-0 sm:pr-12 pb-2 scroll-smooth snap-x snap-mandatory mx-auto"
              style={viewportWidthPx ? { width: viewportWidthPx } : undefined}
            >
              {displayedTimeline.length === 0 && (
                <div className="w-full text-center text-sm text-gray-500 py-6">
                  해당 월의 기록이 없습니다
                </div>
              )}
              {displayedTimeline.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  data-card="true"
                  className="shrink-0 w-[180px] sm:w-[200px] rounded-2xl bg-white  p-3 text-left"
                  onClick={() => openDetail(item)}
                >
                  <div
                    className="relative overflow-hidden"
                    style={{
                      aspectRatio: '700 / 750',
                      borderRadius: 30,
                      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                      backgroundImage: item.img
                        ? `url(${item.img})`
                        : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundColor: '#e5e7eb', // fallback gray
                    }}
                  >
                    {/* 상태 점 */}
                    <span
                      className={`absolute right-2 top-2 h-3.5 w-3.5 rounded-full ${
                        item.done ? 'bg-[#22C55E]' : 'bg-[#EF4444]'
                      }`}
                    />
                  </div>

                  <div className="mt-2 text-sm sm:text-base font-semibold text-center">
                    {item.title}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-gray-500 mt-1 text-center">
                    {item.date}
                  </div>
                  <div className="mt-2 text-[11px] sm:text-[12px] text-gray-700 text-center">
                    {(item.rating ?? '-')}{' '} / 5
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 월 선택 모달 */}
        <Modal
          isOpen={openMonthModal}
          onClose={() => setOpenMonthModal(false)}
          title="월 선택"
        >
          <div className="mt-2">
            <div className="relative h-56">
              {/* center highlight band: fixed overlay at visual center */}
              <div className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 h-12 border-y border-gray-200" />
              <div
                ref={monthListRef}
                onScroll={handleMonthScroll}
                className="h-56 overflow-y-auto no-scrollbar"
                style={{ paddingTop: listSpacer, paddingBottom: listSpacer }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setDraftMonth(m);
                      scrollToMonth(m);
                    }}
                    data-month-item="true"
                    data-month-value={m}
                    className={`w-full text-center h-12 leading-none flex items-center justify-center transition transform duration-200 ease-out ${
                      draftMonth === m
                        ? 'text-black font-bold scale-110'
                        : 'text-gray-400 opacity-60'
                    }`}
                  >
                    {m}월
                  </button>
                ))}
              </div>
            </div>
            <ModalFooter>
              <button
                type="button"
                className="flex-1 rounded-xl bg-[#3B82F6] text-white py-3"
                onClick={() => {
                  setSelectedMonth(draftMonth);
                  setOpenMonthModal(false);
                }}
              >
                확인
              </button>
            </ModalFooter>
          </div>
        </Modal>

        {/* 상세 모달 (개별 크기 지정: 가로 960px, 최소 높이 400px) */}
        <div style={{ '--modal-w-sm': '960px', '--modal-min-h': '400px' }}>
          <Modal
            isOpen={detailOpen}
            onClose={closeDetail}
            title={detailItem?.title || ''}
          >
            <div className="min-h-[400px] flex items-center justify-center gap-8 mt-2">
              {/* 좌측 이미지 + 난이도 */}
              <div className="flex-shrink-0 w-[220px]">
                <div
                  className="w-[220px] h-[260px] rounded-2xl overflow-hidden bg-gray-200"
                  style={{
                    backgroundImage: detailItem?.img
                      ? `url(${detailItem.img})`
                      : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div className="mt-3 text-center text-gray-800 font-semibold">
                  난이도 {difficultyLabel ?? ''}
                </div>
                <div className="mt-2 text-center text-gray-600 text-sm px-2">
                  {detailItem?.raw?.activity?.description ||
                    detailItem?.raw?.description ||
                    '설명 정보가 없습니다.'}
                </div>
              </div>

              {/* 우측 정보 카드 */}
              <div className="flex-1">
                <div className="relative rounded-3xl bg-white border border-gray-100 p-6">
                  <div className="absolute right-4 top-4 text-3xl">
                    {weatherEmoji || null}
                  </div>

                  <div className="space-y-5">
                    <div>
                      <div className="text-sm font-semibold text-gray-700">
                        운동일
                      </div>
                      <div className="mt-1 text-gray-800">
                        {detailItem?.date}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-gray-700">
                        위치
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-gray-800">
                          {detailItem?.locationAddress || '장소 미입력'}
                        </span>
                      </div>
                    </div>

                    {canRate ? (
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-semibold text-gray-700">
                          활동유무
                        </div>
                        <span
                          className={`inline-block h-3.5 w-3.5 rounded-full ${
                            localParticipated ? 'bg-[#22C55E]' : 'bg-[#EF4444]'
                          }`}
                        />
                        <select
                          value={localParticipated ? 'true' : 'false'}
                          onChange={(e) => setLocalParticipated(e.target.value === 'true')}
                          className="border rounded-md px-2 py-1 text-sm ml-2"
                        >
                          <option value="true">참여</option>
                          <option value="false">미참여</option>
                        </select>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 opacity-60">
                        <div className="text-sm font-semibold text-gray-700">
                          활동유무
                        </div>
                        <span className="inline-block h-3.5 w-3.5 rounded-full bg-gray-300" />
                        <span className="text-xs text-gray-500">일정 날짜 이후에 설정할 수 있어요</span>
                      </div>
                    )}

                    {canRate ? (
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-semibold text-gray-700">
                          평점
                        </div>
                        <select
                          value={localRating}
                          onChange={(e) => setLocalRating(Number(e.target.value))}
                          className="border rounded-md px-2 py-1 text-sm"
                        >
                          {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1].map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 opacity-60">
                        <div className="text-sm font-semibold text-gray-700">
                          평점
                        </div>
                        <span className="text-xs text-gray-500">일정 날짜 이후에 설정할 수 있어요</span>
                      </div>
                    )}
                  </div>
                </div>

                <ModalFooter>
                  <button
                    type="button"
                      className={`flex-1 rounded-xl text-white py-3 ${canRate ? 'bg-[#3B82F6]' : 'bg-gray-300 cursor-not-allowed'}`}
                      disabled={!canRate}
                      onClick={async () => {
                        try {
                          const scheduleId =
                            detailItem?.raw?.scheduleId ?? detailItem?.id;
                          if (!scheduleId) return closeDetail();
                          await updateHistoryItem(scheduleId, {
                            isParticipated: localParticipated,
                            rating: localRating,
                          });
                          // fire-and-forget feedback for learning
                          const raw = detailItem?.raw || {};
                          const activityId =
                            raw?.activity?.activityId ?? raw?.activityId;
                          Feedback.send({
                            activityId,
                            rating: localRating,
                            participated: localParticipated,
                            scheduleDate: raw?.scheduleDate,
                            scheduleTime: raw?.scheduleTime,
                            locationAddress: raw?.locationAddress,
                            source: 'HISTORY_MODAL',
                          });
                        } finally {
                          closeDetail();
                        }
                      }}
                  >
                    저장하기
                  </button>
                </ModalFooter>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </main>
  );
}
