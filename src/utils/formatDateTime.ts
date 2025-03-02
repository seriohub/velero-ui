export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  return date.toLocaleDateString('en-US', options);
}
