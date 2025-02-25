/*'use client';

import moment from 'moment';

interface ExpireInProps {
  startTimestamp: string;
  completionTimestamp: string;
}

export default function Duration({ startTimestamp, completionTimestamp }: ExpireInProps) {
  // Helper function to pad numbers with leading zeros
  const pad = (num: number) => `0${num}`.slice(-2);

  // Convert seconds to HH:MM:SS format
  const secondsToHHMMSS = (secs: number): string => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = Math.floor(secs % 60);
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  // Calculate expiration duration and format as a string
  const getExpirationDetails = (start: string, end: string) => {
    const startMoment = moment.utc(start);
    const endMoment = moment.utc(end);

    // Calculate the absolute difference in milliseconds
    const timeDifferenceInMilliseconds = Math.abs(endMoment.diff(startMoment));

    // Get human-readable duration (e.g., "in 3 days")
    const formattedDuration = moment.duration(timeDifferenceInMilliseconds).humanize(true);

    // Convert to HH:MM:SS format
    const duration = secondsToHHMMSS(moment.duration(timeDifferenceInMilliseconds).asSeconds());

    return {
      formattedDuration,
      duration,
    };
  };

  // Get duration values
  const { formattedDuration, duration } = getExpirationDetails(startTimestamp, completionTimestamp);

  // Return the computed values
  return {
    formattedDuration,
    duration,
  };
}*/

import moment from 'moment';

// Helper function to pad numbers with leading zeros
const pad = (num: number) => `0${num}`.slice(-2);

// Convert seconds to HH:MM:SS format
const secondsToHHMMSS = (secs: number): string => {
  const hours = Math.floor(secs / 3600);
  const minutes = Math.floor((secs % 3600) / 60);
  const seconds = Math.floor(secs % 60);
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

// Calculate expiration duration and format as a string
export const getDurationDetails = (start: string, end: string) => {
  const startMoment = moment.utc(start);
  const endMoment = moment.utc(end);

  const timeDifferenceInMilliseconds = Math.abs(endMoment.diff(startMoment));

  const formattedDuration = moment.duration(timeDifferenceInMilliseconds).humanize(true);
  const duration = secondsToHHMMSS(moment.duration(timeDifferenceInMilliseconds).asSeconds());

  return {
    formattedDuration,
    duration,
  };
};
