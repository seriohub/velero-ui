'use client';

import { Badge, Group, Tooltip } from '@mantine/core';
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
import React from 'react';

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
  | 'false'
  | 'Enabled'
  | 'Disabled';

// ✅ Nessuna complicazione con ref: ElementType va benissimo
type StatusIconConfig = {
  color: string;
  icon: React.ElementType;
  className?: string;
  tooltip?: string;
};

const statusConfig: Record<VeleroResourceStatus, StatusIconConfig> = {
  Available: {
    color: 'green.9',
    icon: IconCheck
  },
  Unavailable: {
    color: 'red.9',
    icon: IconX
  },

  Ready: {
    color: 'green.9',
    icon: IconCheck
  },
  Completed: {
    color: 'green.9',
    icon: IconCheck
  },
  Failed: {
    color: 'red.9',
    icon: IconX
  },
  FailedValidation: {
    color: 'red.9',
    icon: IconAlertTriangle
  },
  PartiallyFailed: {
    color: 'red.9',
    icon: IconAlertTriangle
  },
  Deleting: {
    color: 'red.9',
    icon: IconTrash
  },
  InProgress: {
    color: 'yellow.7',
    icon: IconLoader,
    className: 'spin-icon',
    tooltip: 'Operation in progress',
  },

  Running: {
    color: 'green.9',
    icon: IconPlayerPlay
  },
  Paused: {
    color: 'red.9',
    icon: IconPlayerPause
  },

  restic: {
    color: 'yellow.9',
    icon: IconCloud
  },
  kopia: {
    color: 'blue.9',
    icon: IconCloudCog
  },

  true: {
    color: 'var(--mantine-primary-color-9)',
    icon: IconCheck
  },

  false: {
    color: 'var(--mantine-color-red-9)',
    icon: IconX
  },

  Enabled: {
    color: 'green.9',
    icon: IconCheck
  },
  Disabled: {
    color: 'red.9',
    icon: IconX
  },
};

interface VeleroResourceStatusBadgeProps {
  status: VeleroResourceStatus;
}

export default function VeleroResourceStatusBadge({ status }: VeleroResourceStatusBadgeProps) {
  const uiValues = useUIStatus();

  const fallback: StatusIconConfig = {
    color: 'gray',
    icon: IconAlertTriangle,
    className: '',
    tooltip: 'Unknown status',
  };

  const config = statusConfig[status] ?? fallback;
  const IconComponent = config.icon;

  const iconElement = (
    <IconComponent size={18} className={config.className || ''}/>
  );

  const badge = (
    <Badge
      color={config.color}
      radius="xs"
      variant={uiValues.badgeVariant || 'filled'}
      size="md"
      w={150}
    >
      <Group gap={5}>
        {iconElement}
        {status}
      </Group>
    </Badge>
  );

  return config.tooltip ? (
    <Tooltip label={config.tooltip} withArrow>
      {badge}
    </Tooltip>
  ) : (
    badge
  );

}
