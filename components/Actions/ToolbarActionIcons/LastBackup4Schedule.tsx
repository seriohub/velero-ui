'use client';

import { ActionIcon, Chip, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconPlus } from '@tabler/icons-react';

import { CreateBackup } from '../ActionsForm/CreateBackup';
import { useEffect, useState } from 'react';

interface LastBackup4ScheduleProps {
  reload: number;
  setReload: any;
  setOnlyLast4Schedule: any;
}

export default function LastBackup4Schedule({ reload, setReload, setOnlyLast4Schedule }: LastBackup4ScheduleProps) {
  const [checked, setChecked] = useState(false);

  useEffect(()=>{
    setOnlyLast4Schedule(checked);
  }, [checked])
  return (
    <Tooltip label="Only last backup for every schedule">
      <Chip radius="xs" variant="light" checked={checked} onChange={() => setChecked((v) => !v)}>
        Last Backup for schedule
      </Chip>
    </Tooltip>
  );
}
