export function localDate(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function nextDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number);
  return localDate(new Date(year, month - 1, day + 1, 12));
}
export function validStay(checkin: string, checkout: string, today: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(checkin) &&
    /^\d{4}-\d{2}-\d{2}$/.test(checkout) && checkin >= today && checkout > checkin;
}
