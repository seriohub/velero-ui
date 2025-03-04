'use client';

import { Group, Text, Mark } from '@mantine/core';

import { IconClock } from '@tabler/icons-react';
import { WatchdogDeployConfigs } from '@/components/Features/Settings/Watchdog/WatchdogDeployConfigs';

export function WatchdogEnvironment({
  cron,
  deployConfiguration,
  userConfiguration,
  fetching,
}: any) {
  return (
    <>
      <Group mt={15} gap={8}>
        <IconClock size={20} />
        <Text size="md">Kubernetes Cron Jobs for the full report</Text>
        <Text size="md" fw={800}>
          <Mark>{cron && cron.toString()}</Mark>
        </Text>
      </Group>

      <WatchdogDeployConfigs
        fetching={fetching}
        deployConfiguration={deployConfiguration || {}}
        userConfiguration={userConfiguration || {}}
      />
    </>
  );
}
