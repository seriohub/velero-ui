'use client';

import { Badge, Group, Loader } from '@mantine/core';
import { useUIStatus } from '@/contexts/UIContext';

const segmentColors = {
  Available: 'green.9',
  Unavailable: 'red.9',

  Ready: 'green.9',
  Completed: 'green.9',
  Failed: 'red.9',
  FailedValidation: 'red.9',
  PartiallyFailed: 'red.9',
  Deleting: 'red.9',
  InProgress: 'yellow.8',
  Running: 'green.9',
  Paused: 'red.9',

  restic: 'yellow.9',
  kopia: 'blue.9',

  true: 'var(--mantine-primary-color-9)',
  false: 'var(--mantine-color-gray-9)',
};

type VeleroResourceStatus = keyof typeof segmentColors;

interface VeleroResourceStatusBadgeProps {
  status: VeleroResourceStatus;
}

export default function VeleroResourceStatusBadge({ status }: VeleroResourceStatusBadgeProps) {
  const uiValues = useUIStatus();
  return (
    <>
      <Badge color={segmentColors[status]} radius="xs" variant={uiValues.badgeVariant || 'filled'}>
        <Group gap={0}>
          {['InProgress', 'Deleting'].includes(status) && (
            <Loader size={20} color="var(--mantine-color-text)" />
          )}
          {status}
        </Group>
      </Badge>
    </>
  );
}
