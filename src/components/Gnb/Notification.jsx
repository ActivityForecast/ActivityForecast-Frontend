import { useEffect, useState } from 'react';
import { ReactComponent as AlarmIcon } from 'assets/icons/alarm.svg';
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg';
import useClickOutside from 'hooks/useClickOutside';

import {
  fetchNotifications,
  fetchHasUnread,
  markAllNotificationsRead,
  deleteNotification,
} from 'api/notification';
import { formatTimeAgo } from 'utils/formatTimeAgo';

export default function Notification() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasUnread, setHasUnread] = useState(false);

  const close = () => setOpen(false);
  const ref = useClickOutside(close);

  useEffect(() => {
    let mounted = true;

    const loadUnreadFlag = async () => {
      try {
        const unread = await fetchHasUnread();
        if (!mounted) return;
        setHasUnread(!!unread);
      } catch (e) {
        console.error('failed to fetch unread flag', e);
      }
    };

    loadUnreadFlag();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const loadNotifications = async () => {
      setLoading(true);
      setError('');

      try {
        const list = await fetchNotifications();
        if (cancelled) return;

        setNotifications(list || []);

        const hasUnreadInList = (list || []).some((n) => !n.read);
        if (hasUnreadInList) {
          try {
            await markAllNotificationsRead();
            if (!cancelled) {
              setNotifications((prev) =>
                prev.map((n) => ({ ...n, read: true }))
              );
              setHasUnread(false); 
            }
          } catch (e) {
            console.error('failed to mark all notifications as read', e);
          }
        } else {
          setHasUnread(false);
        }
      } catch (e) {
        console.error('failed to fetch notifications', e);
        if (!cancelled) {
          setError('알림을 불러오는 중 오류가 발생했어요.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadNotifications();

    return () => {
      cancelled = true;
    };
  }, [open]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (e) {
      console.error('failed to delete notification', e);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="relative p-2 rounded hover:bg-gray-100"
      >
        <AlarmIcon />
        {hasUnread && (
          <span className="absolute top-1 -right-0.5 h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      {open && (
        <div>
          <div className="fixed z-40 inset-0 bg-black/30" />
          <aside
            ref={ref}
            className="fixed z-50 right-0 top-0 h-full w-[320px] sm:w-[360px] bg-white border-l shadow-xl p-4 overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-gray-200 mb-5">
              <h2 className="text-lg font-semibold">알림</h2>
              <button
                onClick={close}
                className="p-2 text-sm rounded hover:bg-gray-100"
              >
                <CloseIcon />
              </button>
            </div>

            {loading && (
              <div className="text-sm text-gray-500">알림을 불러오는 중...</div>
            )}

            {error && !loading && (
              <div className="text-sm text-red-500 mb-3">{error}</div>
            )}

            {!loading && !error && notifications.length === 0 && (
              <div className="text-sm text-gray-500">
                아직 도착한 알림이 없어요.
              </div>
            )}

            {!loading && !error && notifications.length > 0 && (
              <ul className="space-y-3">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className="text-sm flex flex-col gap-1 border-b pb-3 last:border-b-0"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{n.title}</span>
                          {!n.read && (
                            <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
                          )}
                        </div>
                        <p className="mt-1 text-gray-700 whitespace-pre-line">
                          {n.content}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(n.id)}
                        className="text-xs text-gray-400 hover:text-red-500 whitespace-nowrap"
                      >
                        삭제
                      </button>
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatTimeAgo(n.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
