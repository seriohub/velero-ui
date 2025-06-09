'use client';

import { Button, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { useMediaQuery } from '@mantine/hooks';
import { IconCalendarEvent } from '@tabler/icons-react';

import { HeatMapBox } from '@/components/Features/Velero/Schedules/HeatMapBox';

export default function SchedulesHeatmapToolbarIcon() {
  const isMobile = useMediaQuery('(max-width: 1024px)');
  return (
    <Tooltip label="Cron Schedule Heatmap">
      <Button
        variant="default"
        className="react-table-custom-action"
        h={38}
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            title: 'Cron Schedules Heatmap',
            size: '80rem',
            fullScreen: isMobile,
            children: <HeatMapBox/>,
            padding: 'md',
            radius: 'md',
            centered: true,
          });
        }}
        leftSection={<IconCalendarEvent/>}
      >
        Cron Heatmap
      </Button>
    </Tooltip>
  );
}
