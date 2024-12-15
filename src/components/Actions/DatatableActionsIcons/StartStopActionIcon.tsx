'use client';

import { ActionIcon, Tooltip } from '@mantine/core';

import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';

import { useAppState } from '@/contexts/AppStateContext';
import { useSchedulesStart } from '@/api/Schedule/useScheduleStart';
import { useSchedulesPause } from '@/api/Schedule/useSchedulePause';

interface StartStopActionIconProps {
  resourceName: string;
  paused: boolean;
  reload: number;
  setReload: any;
}

export default function StartStopActionIcon({
  resourceName,
  paused,
  reload,
  setReload,
}: StartStopActionIconProps) {
  const appValues = useAppState();

  const { scheduleStart } = useSchedulesStart();
  const { schedulePause } = useSchedulesPause();

  function unpause_schedule() {
    //getData({url:'/v1/schedule/unpause', param:`resource_name=${resourceName}`});
    scheduleStart(resourceName);
    const interval = setInterval(() => {
      setReload(reload + 1);
      clearInterval(interval);
    }, appValues.refreshDatatableAfter);
  }

  function pause_schedule() {
    schedulePause(resourceName);
    const interval = setInterval(() => {
      setReload(reload + 1);
      clearInterval(interval);
    }, appValues.refreshDatatableAfter);
  }

  return (
    <Tooltip label={paused === true ? 'Start' : 'Pause'}>
      <ActionIcon
        size="sm"
        variant="transparent"
        onClick={(e) => {
          e.stopPropagation();
          paused === true ? unpause_schedule() : pause_schedule();
        }}
      >
        {paused === true && <IconPlayerPlay size={16} color="green" />}
        {paused !== true && <IconPlayerPause size={16} color="orange" />}
      </ActionIcon>
    </Tooltip>
  );
}