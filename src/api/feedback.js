import { api } from './axios';

export const Feedback = {
  // POST /feedback
  send: async (payload) => {
    // best-effort; ignore failures
    try {
      const { data } = await api.post('/feedback', payload);
      return data;
    } catch {
      return null;
    }
  },
};

export default Feedback;


