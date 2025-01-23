'use client';

import { ActionIcon, Tooltip } from '@mantine/core';

import { IconFilter, IconFilterFilled } from '@tabler/icons-react';

import { useEffect, useState } from 'react';

interface LastBackup4ScheduleProps {
  reload: number;
  setReload: any;
  setOnlyLast4Schedule: any;
}

export default function LastBackup4Schedule({
  reload,
  setReload,
  setOnlyLast4Schedule,
}: LastBackup4ScheduleProps) {
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
        {!checked && <IconFilter stroke={1.5} />}
        {checked && <IconFilterFilled stroke={1.5} />}
      </ActionIcon>
      {/*<Chip
        radius={8}
        size="lg"
        //style={{height: "38px"}}
        variant="outline"
        checked={checked}
        onChange={() => setChecked((v) => !v)}

      >
        Last Backups for schedule
      </Chip>*/}
    </Tooltip>
  );
}
