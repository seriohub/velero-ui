'use client';

import { useEffect, useState } from 'react';

import { ActionIcon, Box, Card, Group, Text } from '@mantine/core';

import { IconInfoSquare } from '@tabler/icons-react';

import { useWatchdogAppSecrets } from '@/api/Watchdog/useWatchdogAppSecrets';

import WatchdogServiceConfigTable from '@/components/Features/Settings/Watchdog/WatchdogServiceConfigTable';

export default function WatchdogService() {
  const { data: dataServices, getWatchdogAppSecrets } = useWatchdogAppSecrets();

  const [services, setServices] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    getWatchdogAppSecrets();
  }, []);

  useEffect(() => {
    setServices(Array.isArray(dataServices) ? dataServices : []);
  }, [dataServices]);

  return (
    <>
      <Card withBorder radius="md" p="xl">
        <Card.Section withBorder inheritPadding p="xs">
          <Group gap={3}>
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
              <IconInfoSquare />
            </ActionIcon>
          </Group>
          <Text fz="xs" c="dimmed" mt={3}>
            Config apprise service
          </Text>
        </Card.Section>
        <Card.Section withBorder inheritPadding p="xs">
          <Box mx="auto" w="100%">
            <WatchdogServiceConfigTable services={services} setServices={setServices} />
          </Box>
        </Card.Section>
      </Card>
    </>
  );
}
