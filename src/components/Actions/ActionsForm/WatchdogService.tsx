'use client';

import { useEffect, useState } from 'react';

import { Box, Card, Text } from '@mantine/core';

import WatchdogServiceConfigTable from '@/components/Inputs/WatchdogServiceConfigTable';
import { useWatchdogAppSecrets } from '@/api/Watchdog/useWatchdogAppSecrets';

export default function WatchdogService() {
  const { data: dataServices, getWatchdogAppSecrets } = useWatchdogAppSecrets();

  const [services, setServices] = useState([]);

  const [reload, setReload] = useState(1);

  useEffect(() => {
    getWatchdogAppSecrets();
  }, [reload]);

  useEffect(() => {
    setServices(dataServices?.payload || []);
  }, [dataServices]);

  return (
    <>
      <Card withBorder radius="md" p="xl">
        <Card.Section withBorder inheritPadding p="xs">
          <Text fz="lg" fw={500}>
            Service notification
          </Text>
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
