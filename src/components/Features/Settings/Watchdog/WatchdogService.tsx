'use client';

import { useEffect, useState } from 'react';

import { ActionIcon, Card, Group, Text, useComputedColorScheme } from '@mantine/core';

import { IconHelp } from '@tabler/icons-react';

import { useWatchdogAppSecrets } from '@/api/Watchdog/useWatchdogAppSecrets';

import WatchdogServiceConfigTable from '@/components/Features/Settings/Watchdog/WatchdogServiceConfigTable';

export default function WatchdogService({ reload }: any) {
  const {
    data: dataServices,
    getWatchdogAppSecrets
  } = useWatchdogAppSecrets();
  const computedColorScheme = useComputedColorScheme();
  const [services, setServices] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    getWatchdogAppSecrets();
  }, [reload]);

  useEffect(() => {
    if (reload>1)
      getWatchdogAppSecrets(true);
  }, [reload]);

  useEffect(() => {
    setServices(Array.isArray(dataServices) ? dataServices : []);
  }, [dataServices]);

  return (
    <Card
      radius="xs"
      maw={1000}
      withBorder
      mt={10}
      p="sm"
      bg={computedColorScheme === 'light' ? '' : 'var(--mantine-color-body)'}
    >
      <Group gap={3} justify="space-between">
        <Text fz="lg" fw={500}>
          Service notification
        </Text>
        <ActionIcon
          variant="transparent"
          component="a"
          href="https://vui.seriohub.com/docs/getting-started/configuration/velero-watchdog"
          target="_blank"
          size="xl"
          aria-label="Open in a new tab"
        >
          <IconHelp/>
        </ActionIcon>
      </Group>
      <Text fz="xs" c="dimmed" mt={3}>
        Config apprise service
      </Text>

      <WatchdogServiceConfigTable services={services} setServices={setServices}/>
    </Card>
  );
}
