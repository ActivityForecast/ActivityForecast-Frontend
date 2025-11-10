import React, { useEffect, useMemo, useRef, useState } from 'react';
import Modal, { ModalFooter } from 'components/Modal/Modal';
import ActivityWidget from 'mocks/ActivityWidget';
import { useNavigate } from 'react-router-dom';


function getMonthFromKoreanDate(d, fallbackMonth) {
  const m = /\s(\d{1,2})월/.exec(d);
  return m ? parseInt(m[1], 10) : fallbackMonth;
}

export default function HistoryPage() {
  // 임시 더미 데이터 (해당 월 활동 요약)
  
  
  const segments = useMemo(
    () => [
      { label: '러닝', count: 2 },
      { label: '축구', count: 2 },
      { label: '농구', count: 1 },
    ],
    []
  );

  const total = useMemo(
    () => segments.reduce((a, b) => a + (b.count || 0), 0),
    [segments]
  );

  // 임시 타임라인 데이터 (해당 월)
  const timeline = useMemo(
    () => [
      {
        id: 1,
        title: '축구',
        date: '2025년 10월 17일',
        done: true,
        rating: 5,
        img: null,
        difficulty: '상',
      },
      {
        id: 2,
        title: '러닝',
        date: '2025년 10월 13일',
        done: true,
        rating: 5,
        img: null,
        difficulty: '중',
      },
      {
        id: 3,
        title: '농구',
        date: '2025년 10월 8일',
        done: false,
        rating: 3.5,
        img: null,
        difficulty: '중',
      },
      {
        id: 4,
        title: '축구',
        date: '2025년 10월 3일',
        done: true,
        rating: 4,
        img: null,
        difficulty: '상',
      },
    ],
    []
  );

  // 월 선택 상태
  const thisMonth = useMemo(() => new Date().getMonth() + 1, []);
  const [selectedMonth, setSelectedMonth] = useState(10);
  const [draftMonth, setDraftMonth] = useState(10);
  const [openMonthModal, setOpenMonthModal] = useState(false);
  const monthListRef = useRef(null);
  const scrollEndTimerRef = useRef(null);
  const monthItemHeight = 48;
  const [listSpacer, setListSpacer] = useState(64);

  const monthLabel = `${selectedMonth}월 타임라인`;
  const displayedTimeline = useMemo(
    () =>
      timeline.filter(
        (t) => getMonthFromKoreanDate(t.date, thisMonth) === selectedMonth
      ),
    [timeline, selectedMonth, thisMonth]
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
  const openDetail = (item) => {
    setDetailItem(item);
    setDetailOpen(true);
  };
  const closeDetail = () => setDetailOpen(false);

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
        "
      >
        <h1 className="text-center text-2xl sm:text-3xl font-bold">히스토리</h1>

        {/* 활동요약 */}
        <section className="w-full mt-8">
          <div className="rounded-3xl bg-[#F8FAFC]  p-4 sm:p-6 md:p-8">
            <h2 className="text-base font-semibold  mb-3">활동요약</h2>
            <div className="rounded-2xl shadow-md">
              <ActivityWidget
                accent="#3B82F6"
                total={total}
                segments={segments}
                withBorder={false}
              />
            </div>
          </div>
        </section>

        {/* 타임라인 */}
        <section className="w-full mt-10">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-base font-semibold">타임라인</h2>
          </div>

          <div className="relative rounded-3xl bg-white shadow-sm px-6 py-6">
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
              className="timeline-scroll no-scrollbar flex gap-[18px] overflow-x-auto px-4 pb-2 scroll-smooth snap-x snap-mandatory"
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
                  className="shrink-0 w-[200px] rounded-2xl bg-white  p-3 text-left"
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

                  <div className="mt-2 text-base font-semibold text-center">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1 text-center">
                    {item.date}
                  </div>
                  <div className="mt-2 text-[12px] text-gray-700 text-center">
                    ★ / {item.rating}
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
                  난이도{' '}
                  {detailItem?.difficulty ||
                    (detailItem?.title === '축구'
                      ? '상'
                      : detailItem?.title === '러닝'
                      ? '중'
                      : '중')}
                </div>
              </div>

              {/* 우측 정보 카드 */}
              <div className="flex-1">
                <div className="relative rounded-3xl bg-white border border-gray-100 p-6">
                  <div className="absolute right-4 top-4 text-3xl">☀️</div>

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
                        <span className="text-gray-800">성남시 태평동</span>
                        <span className="text-[11px] rounded-full bg-[#DBEAFE] text-[#3B82F6] px-2 py-[2px]">
                          자세한 위치를 적어주세요
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-sm font-semibold text-gray-700">
                        활동유무
                      </div>
                      <span
                        className={`inline-block h-3.5 w-3.5 rounded-full ${
                          detailItem?.done ? 'bg-[#22C55E]' : 'bg-[#EF4444]'
                        }`}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-sm font-semibold text-gray-700">
                        평점
                      </div>
                      <select
                        defaultValue={detailItem?.rating || 5}
                        className="border rounded-md px-2 py-1 text-sm"
                      >
                        {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1].map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <ModalFooter>
                  <button
                    type="button"
                    className="flex-1 rounded-xl bg-[#3B82F6] text-white py-3"
                    onClick={closeDetail}
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
