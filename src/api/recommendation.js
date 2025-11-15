import { api } from './axios'; 


export async function fetchMainRecommendationsForCards({ locationName, targetDatetime }) {
  const { data } = await api.get('/recommendation/main', {
    params: {
      locationName,
      targetDatetime,
    },
  });

  return (data || []).map((item) => ({
    id: String(item.activityId),              
    label: item.activityName,      
    src: item.imageUrl,
    raw: item,                               
  }));
}
