'use client';

import { Badge } from '@mantine/core';

const segmentColors = {
  Completed: 'green.6',
  Failed: 'red.9',
  'Partial Failed': 'red.7',
  'Failed Validation': 'red.5',
  Deleting: 'gray',
  Unpaused: 'green.6',
  Paused: 'red.9',
};

type BackupStatus = keyof typeof segmentColors;

interface BackupsStatusBadgeProps {
  status: BackupStatus;
}

export default function BackupsStatusBadge({ status }: BackupsStatusBadgeProps) {
  return <Badge color={segmentColors[status]} radius="xs">{status}</Badge>;
}
