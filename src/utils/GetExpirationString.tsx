import moment from 'moment';

export function getExpirationString(expirationDate: string): string {
  const currentDateTime = moment(); // Current date and time
  const eventDateTime = moment.utc(expirationDate); // Event date in UTC format

  const isEventPast = eventDateTime.isBefore(currentDateTime);
  const timeDifferenceInMilliseconds = Math.abs(eventDateTime.diff(currentDateTime));

  const formattedDuration = moment.duration(timeDifferenceInMilliseconds).humanize();
  return isEventPast ? `${formattedDuration} ago` : `${formattedDuration}`;
}
