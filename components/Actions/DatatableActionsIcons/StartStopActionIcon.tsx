'use client';

import { ActionIcon, Tooltip } from '@mantine/core';

import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';

import { useApiGet } from '@/hooks/useApiGet';
import { useAppState } from '@/contexts/AppStateContext';
import { useContext } from 'react';

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
  const { getData } = useApiGet();

  function unpause_schedule() {
    getData({url:'/v1/schedule/unpause', param:`resource_name=${resourceName}`});
    const interval = setInterval(() => {
      setReload(reload + 1);
      clearInterval(interval);
    }, appValues.refreshDatatableAfter);
  }

  function pause_schedule() {
    getData({url:'/v1/schedule/pause', param:`resource_name=${resourceName}`});
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
