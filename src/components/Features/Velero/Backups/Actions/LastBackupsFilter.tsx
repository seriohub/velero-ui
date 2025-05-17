'use client';

import { ActionIcon, Tooltip } from '@mantine/core';

import { IconFilter, IconFilterFilled } from '@tabler/icons-react';

import { useEffect, useState } from 'react';

interface LastBackup4ScheduleProps {
  setOnlyLast4Schedule: any;
}

export default function LastBackupsFilter({ setOnlyLast4Schedule }: LastBackup4ScheduleProps) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setOnlyLast4Schedule(checked);
  }, [checked]);
  return (
    <Tooltip label="Filter last backup for every schedule">
      <ActionIcon
        onClick={() => {
          setChecked(!checked);
        }}
        size={38}
        //variant="default"
        variant="outline"
        radius={8}
      >
        {!checked && <IconFilter stroke={1.5}/>}
        {checked && <IconFilterFilled stroke={1.5}/>}
      </ActionIcon>
    </Tooltip>
  );
}
