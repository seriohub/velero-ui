'use client';

import { ActionIcon, Tooltip } from '@mantine/core';

import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';

import { useApiGet } from '@/hooks/useApiGet';
import VeleroAppContexts from '@/contexts/VeleroAppContexts';
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
  const appValues = useContext(VeleroAppContexts);
  const { getData } = useApiGet();

  function unpause_schedule() {
    getData('/v1/schedule/unpause', `resource_name=${resourceName}`);
    const interval = setInterval(() => {
      setReload(reload + 1);
      clearInterval(interval);
    }, appValues.state.refreshDatatableAfter);
  }

  function pause_schedule() {
    getData('/v1/schedule/pause', `resource_name=${resourceName}`);
    const interval = setInterval(() => {
      setReload(reload + 1);
      clearInterval(interval);
    }, appValues.state.refreshDatatableAfter);
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
