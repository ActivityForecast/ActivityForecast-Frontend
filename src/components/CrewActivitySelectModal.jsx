import { useEffect, useMemo, useState } from 'react';
import Modal, { ModalFooter } from 'components/Modal/Modal';
import Button from 'components/Button';

const CATEGORIES = ['유산소', '구기스포츠', '익스트림스포츠', '피트니스'];

export default function ActivitySelectModal({
  isOpen,
  onClose,
  onConfirm,
  activities = [],
  initialSelected = null,
}) {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    // initialSelected가 배열이면 첫 번째, 단일 값이면 그대로, 없으면 null
    const id = Array.isArray(initialSelected) 
      ? (initialSelected[0] ? (typeof initialSelected[0] === 'string' ? initialSelected[0] : initialSelected[0].id) : null)
      : (initialSelected ? (typeof initialSelected === 'string' ? initialSelected : initialSelected.id) : null);
    setSelectedId(id);
    setActiveCategory(CATEGORIES[0]);
  }, [isOpen, initialSelected]);

  const currentList = useMemo(
    () => activities.filter((a) => a.category === activeCategory),
    [activities, activeCategory]
  );

  const toggle = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const clearSelection = () => setSelectedId(null);

  const handleConfirm = () => {
    if (!selectedId) return;
    onConfirm?.(selectedId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="운동 선택하기"
      position="center"
      isCloseOutsideClick={true}
    >
      <div className="flex flex-wrap gap-2 mt-6 mb-4">
        {CATEGORIES.map((cat) => (
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
            const checked = selectedId === act.id;
            return (
              <label
                key={act.id}
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="activity-select"
                    checked={checked}
                    onChange={() => toggle(act.id)}
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

      {selectedId && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {(() => {
              const item = activities.find((a) => a.id === selectedId);
              return (
                <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700">
                  {item?.name ?? selectedId}
                </span>
              );
            })()}
          </div>
          <button
            type="button"
            onClick={clearSelection}
            className="text-xs text-gray-500 underline decoration-dotted"
          >
            선택 해제
          </button>
        </div>
      )}

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
              disabled={!selectedId}
            >
              선택 완료
            </Button>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
}
