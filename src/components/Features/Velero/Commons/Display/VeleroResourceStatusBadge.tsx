'use client';

import { Badge } from '@mantine/core';

const segmentColors = {
  Available: 'green.6',
  Unavailable: 'red.9',

  Ready: 'green.6',
  Completed: 'green.6',
  Failed: 'red.9',
  FailedValidation: 'red.9',
  'Partial Failed': 'red.7',
  'Failed Validation': 'red.5',
  Deleting: 'gray',

  Running: 'green.6',
  Paused: 'red.9',

  restic: 'gray.7',
  kopia: 'blue.7',

  true: 'var(--mantine-primary-color-8)',
  false: 'var(--mantine-color-gray-8)',
};

type VeleroResourceStatus = keyof typeof segmentColors;

interface VeleroResourceStatusBadgeProps {
  status: VeleroResourceStatus;
}

export default function VeleroResourceStatusBadge({ status }: VeleroResourceStatusBadgeProps) {
  return (
    <Badge color={segmentColors[status]} radius="xs">
      {status}
    </Badge>
  );
}
