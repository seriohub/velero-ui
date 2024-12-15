'use client';

import { Text, Tooltip } from '@mantine/core';
import moment from 'moment';

interface ExpireInProps {
  startTimestamp: string;
  completionTimestamp: string;
}

export default function Duration({ startTimestamp, completionTimestamp }: ExpireInProps) {
  function pad(num: number) {
    return ('0' + num).slice(-2);
  }

  function secondsToHHMMSS(secs: number) {
    var hours = Math.floor(secs / 3600);
    secs = secs % 3600;
    var minutes = Math.floor(secs / 60);
    secs = secs % 60;
    return pad(hours) + ':' + pad(minutes) + ':' + pad(secs);
  }

  function expirationString(s: string, e: string) {
    const start = moment.utc(s); // Current date and time
    const end = moment.utc(e); // Event date and time provided in UTC format

    // Calculate the absolute difference between the current time and the event time
    const timeDifferenceInMilliseconds = Math.abs(end.diff(start));

    // Get the human-readable duration format
    const formattedDuration = moment.duration(timeDifferenceInMilliseconds).humanize(true); //.hours() + ":" + moment.duration(timeDifferenceInMilliseconds).minutes() + ":" + moment.duration(timeDifferenceInMilliseconds).seconds();
    const duration = secondsToHHMMSS(moment.duration(timeDifferenceInMilliseconds).asSeconds());
    // Construct the resulting string with an indication of whether the event is in the past or future
    //const result = formattedDuration + ":" + duration;

    return {"formattedDuration": formattedDuration, "duration": duration};
  }

  const values = expirationString(startTimestamp, completionTimestamp)
  const formattedDuration = values.formattedDuration
  const duration = values.duration.toString()
  // console.log(values)

  return (
    <>
      
      <Tooltip label={duration} color="blue" offset={5}>
        <Text size="sm">{formattedDuration}</Text>
    </Tooltip>
    </>
  );
}
