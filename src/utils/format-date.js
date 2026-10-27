const pad = (value) => String(value).padStart(2, '0');

/**
 * 목록용 날짜 표기 (네이버 카페 방식)
 * 오늘 작성한 글은 'HH:mm', 그 외에는 'YYYY.MM.DD'
 */
export function formatListDate(isoString) {
  const date = new Date(isoString);
  const isToday = date.toDateString() === new Date().toDateString();
  if (isToday) {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
}

/**
 * 상세용 날짜 표기 'YYYY.MM.DD HH:mm'
 */
export function formatDateTime(isoString) {
  const date = new Date(isoString);
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
