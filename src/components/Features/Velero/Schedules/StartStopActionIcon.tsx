'use client';

import { ActionIcon, Button, Tooltip } from '@mantine/core';
import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';

import { useSchedulesStart } from '@/api/Schedule/useScheduleStart';
import { useSchedulesPause } from '@/api/Schedule/useSchedulePause';

interface StartStopActionIconProps {
  resourceName: string;
  paused: boolean;
  buttonType?: 'actionIcon' | 'button';
}

const StartStopActionIcon: React.FC<StartStopActionIconProps> = ({
                                                                   resourceName,
                                                                   paused,
                                                                   buttonType = 'actionIcon',
                                                                 }) => {
  const { scheduleStart } = useSchedulesStart();
  const { schedulePause } = useSchedulesPause();

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (paused) {
      scheduleStart(resourceName);
    } else {
      schedulePause(resourceName);
    }
    /*const interval = setInterval(() => {
      setReload(reload + 1);
      clearInterval(interval);
    }, appValues.refreshDatatableAfter);*/
  };

  return buttonType === 'actionIcon' ? (
    <Tooltip label={paused ? 'Start' : 'Pause'}>
      <ActionIcon size="sm" variant="subtle" onClick={handleAction}>
        {paused ? <IconPlayerPlay color="green"/> : <IconPlayerPause color="orange"/>}
      </ActionIcon>
    </Tooltip>
  ) : (
    <Button
      h={38}
      leftSection={paused ? <IconPlayerPlay/> : <IconPlayerPause/>}
      color={paused ? 'green' : 'orange'}
      onClick={handleAction}
    >
      {paused ? 'Start' : 'Pause'}
    </Button>
  );
};

export default StartStopActionIcon;
