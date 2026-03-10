export function formatTimeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 10) return "Just now"; // very recent
  if (seconds < 60) return `${seconds}s`; // show seconds for 10–59s

  const intervals = [
    { label: "m", seconds: 60 },
    { label: "h", seconds: 3600 },
    { label: "d", seconds: 86400 },
    { label: "w", seconds: 604800 },
    { label: "mo", seconds: 2592000 },
    { label: "y", seconds: 31536000 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count}${interval.label}`;
    }
  }

  return "Just now";
}

export function formatDate(date: Date) {
  const result = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);

  return result;
}
