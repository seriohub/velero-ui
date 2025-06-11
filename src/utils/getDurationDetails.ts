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

export const getDurationInMilliseconds = (start: string, end: string) => {
  const startMoment = moment.utc(start);
  const endMoment = moment.utc(end);

  return Math.abs(endMoment.diff(startMoment));
};

// Calculate expiration duration and format as a string
export const getDurationDetails = (timeDifferenceInMilliseconds: number) => {
  const humanDuration = moment.duration(timeDifferenceInMilliseconds).humanize(true);
  const durationHHmmss = secondsToHHMMSS(moment.duration(timeDifferenceInMilliseconds).asSeconds());
  return {
    humanDuration,
    durationHHmmss,
  };
};
