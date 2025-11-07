import { useMemo, useState } from 'react';
import Modal, { ModalFooter } from 'components/Modal/Modal';
import Button from 'components/Button';

export default function ActivitySelectModal({
  isOpen,
  onClose,
  onConfirm,
  activities = [],
}) {
  const categories = ['유산소', '구기스포츠', '익스트림스포츠', '피트니스'];
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const [selected, setSelected] = useState(() =>
    Object.fromEntries(categories.map((c) => [c, new Set()]))
  );

  const currentList = useMemo(
    () => activities.filter((a) => a.category === activeCategory),
    [activities, activeCategory]
  );

  const countByCategory = (cat) => selected[cat]?.size ?? 0;

  const disabledBecauseFull = (cat, id) =>
    !selected[cat].has(id) && selected[cat].size >= 2;

  const toggle = (cat, id) => {
    setSelected((prev) => {
      const next = { ...prev, [cat]: new Set(prev[cat]) };
      if (next[cat].has(id)) {
        next[cat].delete(id);
      } else {
        if (next[cat].size >= 2) return prev;
        next[cat].add(id);
      }
      return next;
    });
  };

  const clearCategory = (cat) =>
    setSelected((prev) => ({ ...prev, [cat]: new Set() }));

  const hasAnySelected = categories.some((c) => (selected[c]?.size ?? 0) > 0);

  const handleConfirm = () => {
    if (!hasAnySelected) return;
    const payload = categories.reduce((acc, c) => {
      acc[c] = activities
        .filter((a) => a.category === c && selected[c].has(a.id))
        .map((a) => ({ id: a.id, name: a.name }));
      return acc;
    }, {});
    onConfirm?.(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="운동 선택하기"
      position="center"
      isCloseOutsideClick={true}
    >
      <div className="flex gap-2 mt-6 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-2 border text-sm transition
              ${
                activeCategory === cat
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-[#3B82F6] hover:bg-gray-100 hover:border-blue-800'
              }`}
          >
            {cat}
            <span className="ml-1 text-xs text-gray-400">
              ({countByCategory(cat)}/2)
            </span>
          </button>
        ))}
      </div>

      <div className="max-h-72 overflow-auto rounded-md border border-gray-200 divide-y">
        {currentList.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">
            해당 카테고리의 활동이 없습니다.
          </div>
        ) : (
          currentList.map((act) => {
            const checked = selected[act.category].has(act.id);
            const hardDisabled = disabledBecauseFull(act.category, act.id);
            return (
              <label
                key={act.id}
                className={`flex items-center justify-between p-3 cursor-pointer ${
                  hardDisabled && !checked
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={hardDisabled && !checked}
                    onChange={() => toggle(act.category, act.id)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">{act.name}</span>
                </div>
                {checked && (
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    선택됨
                  </span>
                )}
              </label>
            );
          })
        )}
      </div>

      <div className="mt-4 space-y-2">
        {categories.map((cat) => (
          <div key={cat} className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {[...selected[cat]].map((id) => {
                const item = activities.find((a) => a.id === id);
                return (
                  <span
                    key={id}
                    className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700"
                  >
                    {item?.name ?? id}
                  </span>
                );
              })}
            </div>
            {selected[cat].size > 0 && (
              <button
                type="button"
                onClick={() => clearCategory(cat)}
                className="text-xs text-gray-500 underline decoration-dotted"
              >
                {cat} 비우기
              </button>
            )}
          </div>
        ))}
      </div>

      <ModalFooter>
        <div className="flex w-full items-center justify-end">
          <div className="flex gap-2">
            <Button
              type="button"
              styleType="ghost"
              size="py-2 px-4"
              state="default"
              onClick={onClose}
            >
              취소
            </Button>
            <Button
              type="button"
              styleType="solid"
              size="py-2 px-4"
              state="default"
              onClick={handleConfirm}
              disabled={!hasAnySelected}
            >
              선택 완료
            </Button>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
}
