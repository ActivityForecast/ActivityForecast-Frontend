import { useEffect, useRef, useState } from 'react';
import Modal, { ModalFooter } from 'components/Modal/Modal';
import { externalSearchLocations, geocode, searchLocations } from 'api/location';
import { useDebounce } from 'hooks/useDebounce';
import { useLocationStore } from 'stores/location';
import { looksAddressish } from 'utils/looksAddressish';
import { useAuthStore } from 'stores/auth';

const norm = (s) => (s || '').toLowerCase();
const contains = (hay, needle) => norm(hay).includes(norm(needle));

export default function LocationModal({ isOpen = true, onClose, onConfirm }) {
  const [keyword, setKeyword] = useState('');
  const debounced = useDebounce(keyword, 300);
  const { accessToken } = useAuthStore();
  const loggedIn = !!accessToken;

  const [list, setList] = useState([]);
  const [picked, setPicked] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const listRef = useRef(null);
  const reqSeqRef = useRef(0);
  const abortRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      // 새로운 검색 시작 전 초기화
      setError(null);
      setPicked(null);
      setActiveIndex(-1);

      // 모달이 닫혀 있거나, 최소 길이 미만이면 아무 것도 하지 않습니다.
      const q = (debounced || '').trim();
      if (q.length < 2 || !isOpen) {
        setList([]);
        return;
      }

      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const mySeq = ++reqSeqRef.current;

      const sel = useLocationStore.getState().selected;
      let centerLat = sel?.latitude ?? 37.5665;
      let centerLng = sel?.longitude ?? 126.9780;

      // 주소, 지명형으로 보이면, 먼저 지오코딩해서 중심 좌표를 검색어 주변으로 맞춥니다.
      let preferExternalOnly = false;
      if (looksAddressish(q)) {
        try {
          const g = await geocode(q, { signal: controller.signal });
          if (!mounted || mySeq !== reqSeqRef.current) return;
          if (g?.latitude && g?.longitude) {
            centerLat = g.latitude;
            centerLng = g.longitude;
            preferExternalOnly = true;
          }
        } catch (_) {}
      }

      setList([]);
      setLoading(true);

      try {
        // 외부 검색을 먼저 수행합니다.
        const external = await externalSearchLocations({
          latitude: centerLat,
          longitude: centerLng,
          radiusKm: 10,
          activityId: 25,
          keyword: q,
          signal: controller.signal,
        });
        if (!mounted || mySeq !== reqSeqRef.current) return;
        
        // 외부 검색 결과도 키워드가 포함되었는지 여부를 검사할게요.
        const filteredExternal = (external || []).filter((r) => {
          const name = r.locationName ?? r.name ?? '';
          const addr = r.address ?? '';
          return contains(name, q) || contains(addr, q);
        });

        let merged = filteredExternal;

        if (!preferExternalOnly) {
          let internal = [];
          try {
            internal = await searchLocations(q, { signal: controller.signal });
          } catch (_) {}
          if (!mounted || mySeq !== reqSeqRef.current) return;

          const filteredInternal = (internal || []).filter((r) => {
            const name = r.locationName ?? r.name ?? '';
            const addr = r.address ?? '';
            return contains(name, q) || contains(addr, q);
          });

          const byKey = new Map();
          const push = (r) => {
            const key = r.locationId ?? r.id ?? `${r.locationName ?? r.name ?? r.address}`;
            if (!byKey.has(key)) byKey.set(key, r);
          };
          (external || []).forEach(push);
          filteredInternal.forEach(push);
          merged = Array.from(byKey.values());
        }

        if (!mounted || mySeq !== reqSeqRef.current) return;

        setList(
          merged.map((r, i) => ({
            id: r.locationId ?? r.id ?? `loc-${i}`,
            name: r.locationName ?? r.name ?? r.address ?? '',
            address: r.address ?? '',
            latitude: r.latitude ?? null,
            longitude: r.longitude ?? null,
            _raw: r,
          }))
        );
      } catch (e) {
        if (!mounted || mySeq !== reqSeqRef.current) return;
        if (e?.name !== 'CanceledError' && e?.message !== 'canceled') {
          setError(e?.message || '검색 중 오류가 발생했습니다.');
        }
      } finally {
        if (mounted && mySeq === reqSeqRef.current) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      if (abortRef.current) abortRef.current.abort();
    };
  }, [debounced, isOpen]);


  function handleKeyDown(e) {
    if (!list.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => {
        const ni = Math.min(list.length - 1, i + 1);
        setPicked(list[ni]);
        scrollIntoView(ni);
        return ni;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => {
        const ni = Math.max(0, i - 1);
        setPicked(list[ni]);
        scrollIntoView(ni);
        return ni;
      });
    } else if (e.key === 'Enter' && picked) {
      e.preventDefault();
      onConfirmAndClose();
    }
  }

  function scrollIntoView(index) {
    const ul = listRef.current;
    const li = ul?.children?.item(index);
    li?.scrollIntoView({ block: 'nearest' });
  }

  async function onConfirmAndClose() {
    if (!picked) return;
    let loc = { ...picked };
    if (!loc.latitude || !loc.longitude) {
      try {
        const g = await geocode(loc.address || loc.name);
        if (g?.latitude && g?.longitude) {
          loc.latitude = g.latitude;
          loc.longitude = g.longitude;
        }
      } catch (_) {}
    }
    onConfirm(loc);
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="위치 변경"
      isCloseOutsideClick={false}
      position="center"
      style={{ '--modal-w-sm': '384px' }}
    >
      <div className="mt-3">
        {!loggedIn ? (
          <p className="p-4 text-sm text-gray-500 text-center">
            로그인을 하고 위치 검색을 진행해주세요.
          </p>
        ) : (
          <>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="원하시는 위치를 검색하세요(2글자 이상)"
              className="w-full rounded-lg bg-[#F3F8FD] px-4 py-3 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div className="mt-3 max-h-72 overflow-auto rounded-lg border border-gray-200">
              {loading && <div className="p-4 text-sm text-gray-500">검색 중…</div>}
              {!loading && error && <div className="p-4 text-sm text-red-500">{error}</div>}
              {!loading && list.length === 0 && debounced.trim().length >= 1 && (
                <div className="p-4 text-sm text-gray-500">검색 결과가 없습니다.</div>
              )}
              {!loading && list.length > 0 && (
                <ul ref={listRef}>
                  {list.map((item, idx) => {
                    const active = idx === activeIndex || (picked && picked.id === item.id);
                    return (
                      <li
                        key={item.id}
                        className={`px-4 py-3 text-sm cursor-pointer hover:bg-blue-50 ${
                          active ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => {
                          setActiveIndex(idx);
                          setPicked(item);
                        }}
                      >
                        <div className="font-medium">{item.name}</div>
                        {item.address && (
                          <div className="text-xs text-gray-500 mt-0.5">{item.address}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </>
        )}
      </div>

      {loggedIn && (
        <ModalFooter>
          <button
            className={`w-full rounded-xl py-3 text-white font-medium transition ${
              picked ? 'bg-[#0d99ff] hover:bg-blue-500' : 'bg-gray-300 cursor-not-allowed'
            }`}
            onClick={onConfirmAndClose}
            disabled={!picked}
          >
            완료
          </button>
        </ModalFooter>
      )}
    </Modal>
  );
}
