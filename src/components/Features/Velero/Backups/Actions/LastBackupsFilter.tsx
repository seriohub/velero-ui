'use client';

import { Button, Tooltip } from '@mantine/core';
import { IconHistory, IconHistoryOff } from '@tabler/icons-react';
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
    <>
      <Tooltip label="Filter last backup for every schedule">
        <Button
          className="react-table-custom-action"
          onClick={() => {
            setChecked(!checked);
          }}
          h={38}
          variant={!checked ? "default" : 'light'}
          leftSection={<>
            {!checked && <IconHistory/>}
            {checked && <IconHistoryOff/>}
          </>}
        >
          Latest
        </Button>
      </Tooltip>
    </>
  );
}
