import { api } from './axios';

export const History = {
  // GET /api/history?year=&month=
  listMonthly: async (year, month) => {
    const { data } = await api.get('/history', { params: { year, month } });
    return data;
  },

  // GET /api/history/stats?year=&month=
  getMonthlyStats: async (year, month) => {
    const { data } = await api.get('/history/stats', {
      params: { year, month },
    });
    return data;
  },

  // PATCH /api/history/{scheduleId}
  updateItem: async (scheduleId, payload) => {
    const { data } = await api.patch(`/history/${scheduleId}`, payload);
    return data;
  },

  // POST /api/history
  createItem: async (payload) => {
    const { data } = await api.post('/history', payload);
    return data;
  },
};

export default History;


