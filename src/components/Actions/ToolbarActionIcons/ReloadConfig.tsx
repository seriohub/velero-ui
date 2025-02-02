'use client';

import { Button, Tooltip } from '@mantine/core';
import {IconAlertSquareRounded , IconTriangle} from '@tabler/icons-react';

function differencesToString({ differences }: { differences: any }) {
  if (differences !== undefined && differences !== null) {
    return Object.entries(differences)
      .map(([key, values]: any) => `${key}: pod env=${values.obj1}, new value=${values.obj2}; `)
      .join(' ');
  }

  return 'Reload config in watchdog';
}

export default function ReloadConfig({
  watchdogReloadConfig,
  hasDiff,
  difference,
  setReload,
}: any) {
  if (!hasDiff) {
    return (
      <Button
        onClick={(e) => {
          e.stopPropagation();
          watchdogReloadConfig().then(() => {
            setReload((prev: number) => prev + 1);
          });
        }}
        aria-label="ActionIcon with size as a number"
        h={38}
        radius="md"
      >
        Reload Config
      </Button>
    );
  }
  return (
    <Tooltip
      multiline
      label={`Reload configuration in watchdog pod ${differencesToString({ differences: difference })}`}
      w={300}
      style={{ whiteSpace: 'pre-wrap' }}
    >
      <Button
        onClick={(e) => {
          e.stopPropagation();
          watchdogReloadConfig().then(() => {
            setReload((prev: number) => prev + 1);
          });
        }}
        aria-label="ActionIcon with size as a number"
        h={38}
        radius="md"
        leftSection={hasDiff ? <IconAlertSquareRounded /> : <></>}
      >
        Reload Config
      </Button>
    </Tooltip>
  );
}
