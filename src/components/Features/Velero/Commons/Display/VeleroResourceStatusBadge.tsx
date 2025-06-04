'use client';

import { Badge, Box, Group } from '@mantine/core';
import {
  IconAlertTriangle,
  IconCheck,
  IconCloud,
  IconCloudCog,
  IconLoader,
  IconPlayerPause,
  IconPlayerPlay,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { useUIStatus } from '@/contexts/UIContext';
import { JSX } from 'react';

type VeleroResourceStatus =
  | 'Available'
  | 'Unavailable'
  | 'Ready'
  | 'Completed'
  | 'Failed'
  | 'FailedValidation'
  | 'PartiallyFailed'
  | 'Deleting'
  | 'InProgress'
  | 'Running'
  | 'Paused'
  | 'restic'
  | 'kopia'
  | 'true'
  | 'false';

const statusConfig: Record<
  VeleroResourceStatus,
  { color: string; icon: JSX.Element }
> = {
  Available: {
    color: 'green.9',
    icon: <IconCheck size={18}/>
  },
  Unavailable: {
    color: 'red.9',
    icon: <IconX size={18}/>
  },
  Ready: {
    color: 'green.9',
    icon: <IconCheck size={18}/>
  },
  Completed: {
    color: 'green.9',
    icon: <IconCheck size={18}/>
  },
  Failed: {
    color: 'red.9',
    icon: <IconX size={18}/>
  },
  FailedValidation: {
    color: 'red.9',
    icon: <IconAlertTriangle size={18}/>
  },
  PartiallyFailed: {
    color: 'red.9',
    icon: <IconAlertTriangle size={18}/>
  },
  Deleting: {
    color: 'red.9',
    icon: <IconTrash size={18}/>
  },
  InProgress: {
    color: 'yellow.7',
    icon: <IconLoader size={18} className="icon-spin"/>
  },
  Running: {
    color: 'green.9',
    icon: <IconPlayerPlay size={18}/>
  },
  Paused: {
    color: 'red.9',
    icon: <IconPlayerPause size={18}/>
  },
  restic: {
    color: 'yellow.9',
    icon: <IconCloud size={18}/>
  },
  kopia: {
    color: 'blue.9',
    icon: <IconCloudCog size={18}/>
  },
  true: {
    color: 'var(--mantine-primary-color-9)',
    icon: <IconCheck size={18}/>
  },
  false: {
    color: 'var(--mantine-color-red-9)',
    icon: <IconX size={18}/>
  },
};

interface VeleroResourceStatusBadgeProps {
  status: VeleroResourceStatus;
}

export default function VeleroResourceStatusBadge({ status }: VeleroResourceStatusBadgeProps) {
  const uiValues = useUIStatus();

  const fallback = {
    color: 'gray',
    icon: <IconAlertTriangle size={18}/>,
  };
  const config = statusConfig[status] ?? fallback;

  return (
    <Box w="100%">
      <Badge
        color={config.color}
        radius="xs"
        variant={uiValues.badgeVariant || 'filled'}
        w="100%"
        maw={300}
        size="md"
      >
        <Group gap={5}>
          {config.icon}
          {status}
        </Group>
      </Badge>
    </Box>
  );
}
