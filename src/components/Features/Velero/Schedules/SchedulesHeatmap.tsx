'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconCalendarWeek } from '@tabler/icons-react';

import { useMediaQuery } from '@mantine/hooks';
import { HeatMapBox } from '@/components/Features/Velero/Schedules/HeatMapBox';

export default function SchedulesHeatmapToolbarIcon() {
  const isMobile = useMediaQuery('(max-width: 1024px)');
  return (
    <Tooltip label="Cron Schedule Heatmap">
      <ActionIcon
        size={38}
        radius={8}
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            title: 'Cron Schedules Heatmap',
            size: '80rem',
            fullScreen: isMobile,
            children: <HeatMapBox />,
          });
        }}
      >
        <IconCalendarWeek stroke="1.5" />
      </ActionIcon>
    </Tooltip>
  );
}
