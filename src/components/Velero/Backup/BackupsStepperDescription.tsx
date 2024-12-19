'use client';

import VeleroResourceStatusBadge from '../VeleroResourceStatusBadge';

const segmentColors = {
  Completed: 'green.6',
  Failed: 'red.9',
  'Partial Failed': 'red.7',
  'Failed Validation': 'red.5',
  Deleting: 'gray',
  Unpaused: 'green.6',
  Paused: 'red.9',
};

export default function BackupsStepperDescription({ backup }: any) {
  return <VeleroResourceStatusBadge status={backup?.status?.phase} />;
}
