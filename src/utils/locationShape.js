export function locationShape(selected) {
  if (!selected) return null;
  const lat =
    selected.lat ?? selected.latitude ?? selected.coord?.lat ?? selected.coords?.latitude;
  const lon =
    selected.lon ?? selected.longitude ?? selected.coord?.lon ?? selected.coords?.longitude;
  const name =
    selected.name ?? selected.label ?? selected.city ?? selected.address ?? selected.roadAddress;
  if (typeof lat !== 'number' || typeof lon !== 'number') return null;
  return { lat, lon, name: name || '선택한 위치' };
}
