export function getReadableTime(seconds: number) {
  if (seconds < 1)
    return `${(seconds * 60).toFixed(0)}s`;
  
  return `${seconds.toFixed(2)}m`;
}