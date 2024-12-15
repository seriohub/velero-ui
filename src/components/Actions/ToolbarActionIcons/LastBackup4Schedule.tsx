'use client';

import { ActionIcon, Chip, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconFilter, IconFilterFilled, IconPlus } from '@tabler/icons-react';

import { CreateBackup } from '../ActionsForm/CreateBackup';
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
              onClick={() => {console.log(checked);setChecked(!checked)}}
              size={38}
              //variant="default"
              variant="outline"
              radius={8}
              
            >
              {!checked && (
              <IconFilter stroke={2} />
            )}
            {checked && (
              <IconFilterFilled stroke={2} />
            )}
            </ActionIcon>
      {/*<Chip
        radius={8}
        size="lg"
        //style={{height: "38px"}}
        variant="outline"
        checked={checked}
        onChange={() => setChecked((v) => !v)}
        
      >
        Last Backup for schedule
      </Chip>*/}
    </Tooltip>
  );
}
