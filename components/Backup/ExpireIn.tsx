'use client';

import moment from 'moment';

interface ExpireInProps {
  expiration: string;
}

export default function ExpireIn({ expiration }: ExpireInProps) {
  function expirationString(expirationDate: string) {
    const currentDateTime = moment(); // Current date and time
    const eventDateTime = moment.utc(expirationDate); // Event date and time provided in UTC format

    // Check if the event is in the past or future
    const isEventPast = eventDateTime.isBefore(currentDateTime);

    // Calculate the absolute difference between the current time and the event time
    const timeDifferenceInMilliseconds = Math.abs(eventDateTime.diff(currentDateTime));

    // Get the human-readable duration format
    const formattedDuration = moment.duration(timeDifferenceInMilliseconds).humanize();

    // Construct the resulting string with an indication of whether the event is in the past or future
    const result = isEventPast ? `${formattedDuration} ago` : `Until event: ${formattedDuration}`;

    return result;
  }

  return <>{expirationString(expiration)}</>;
}
