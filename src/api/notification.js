import { api } from './axios'; 


export const fetchNotifications = async () => {
  const res = await api.get('/notifications');
  return res.data;
};

export const fetchHasUnread = async () => {
  const res = await api.get('/notifications/unread');
  return res.data;
};


export const markAllNotificationsRead = async () => {
  const res = await api.put('/notifications/read');
  return res.data;
};

export const deleteNotification = async (notificationId) => {
  const res = await api.delete(`/notifications/${notificationId}`);
  return res.data;
};