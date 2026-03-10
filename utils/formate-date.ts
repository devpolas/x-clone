export function formateTimeAgo(date: Date) {
  const now = new Date();

  const differentInSeconds = Math.floor(now.getTime() - date.getTime() / 1000);

  if (differentInSeconds < 60) {
    return `${differentInSeconds}s`;
  }

  if (differentInSeconds < 3600) {
    return `${Math.floor(differentInSeconds / 60)}m`;
  }

  if (differentInSeconds < 86400) {
    return `${Math.floor(differentInSeconds / 3600)}h`;
  }

  if (differentInSeconds < 2592000) {
    return `${Math.floor(differentInSeconds / 86400)}d`;
  }

  return `${Math.floor(differentInSeconds / 2592000)}mo`;
}
