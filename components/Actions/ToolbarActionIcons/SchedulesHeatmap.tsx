'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconCalendarWeek } from '@tabler/icons-react';

import { Heatmap } from '@/components/Schedule/Heatmap';

export default function SchedulesHeatmapToolbarIcon() {
  return (
    <Tooltip label="Cron Schedule Heatmap">
      <ActionIcon
        size={30}
        variant="default"
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            title: 'Cron Schedule Heatmap',
            size: '80%',
            children: <Heatmap />,
          });
        }}
      >
        <IconCalendarWeek style={{ width: '70%', height: '70%' }} />
      </ActionIcon>
    </Tooltip>
  );
}
