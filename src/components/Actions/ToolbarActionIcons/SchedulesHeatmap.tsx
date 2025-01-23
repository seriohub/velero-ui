'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconCalendarWeek } from '@tabler/icons-react';

import { useMediaQuery } from '@mantine/hooks';
import { Heatmap } from '@/components/Velero/Schedules/Heatmap';

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
            children: <Heatmap />,
          });
        }}
      >
        <IconCalendarWeek stroke="1.5" />
      </ActionIcon>

      {/*<ActionIcon
        size={30}
        variant="default"
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            title: 'Cron Schedules Heatmap',
            size: '80%',
            children: <Heatmap />,
          });
        }}
      >
        <IconCalendarWeek style={{ width: '70%', height: '70%' }} />
      </ActionIcon>*/}
    </Tooltip>
  );
}
