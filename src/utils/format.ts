export function formatTimestamp(timestampMs: number) {
  const date = new Date(timestampMs);
  return date.toLocaleString();
}

