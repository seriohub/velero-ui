'use client';

import { Button, Tooltip } from '@mantine/core';
import { IconAlertSquareRounded } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

export default function ReloadConfig({ watchdogReloadConfig, hasDiff, setReload }: any) {
  if (!hasDiff) {
    return (
      <Button
        onClick={(e) => {
          e.stopPropagation();
          watchdogReloadConfig().finally(() => {
            setReload((prev: number) => prev + 1);
          });
        }}
        aria-label="ActionIcon with size as a number"
        h={38}
        radius="md"
      >
        Restart Watchdog
      </Button>
    );
  }
  return (
    <Tooltip
      multiline
      label="Restart Watchdog to apply the new configuration"
      w={300}
      style={{ whiteSpace: 'pre-wrap' }}
    >
      <Button
        onClick={(e) => {
          e.stopPropagation();
          watchdogReloadConfig().finally(() => {
            setReload((prev: number) => prev + 1);
          });
          notifications.show({
            title: 'Watchod reboot in progress!',
            message: 'The data on this page will be available again shortly',
          });
        }}
        aria-label="ActionIcon with size as a number"
        h={38}
        radius="md"
        leftSection={<IconAlertSquareRounded />}
      >
        Needed Restart Watchdog
      </Button>
    </Tooltip>
  );
}
