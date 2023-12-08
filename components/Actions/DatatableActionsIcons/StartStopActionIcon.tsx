'use client';

import { ActionIcon, Tooltip } from '@mantine/core';

import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';

import { useApiWithGet } from '@/hooks/useApiWithGet';

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
  const { data, getData, error, fetching } = useApiWithGet();

  function unpause_schedule() {
    getData('/api/v1/schedule/unpause', `resource_name=${resourceName}`);
    const interval = setInterval(() => {
      setReload(reload + 1);
      clearInterval(interval);
    }, 5000);
  }

  function pause_schedule() {
    getData('/api/v1/schedule/pause', `resource_name=${resourceName}`);
    const interval = setInterval(() => {
      setReload(reload + 1);
      clearInterval(interval);
    }, 5000);
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
