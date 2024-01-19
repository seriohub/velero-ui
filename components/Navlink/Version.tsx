import { useEffect } from 'react';

import { Alert, Code, Group, Stack, Text } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

import { useApiGet } from '@/hooks/useApiGet';

export const Version = () => {
  const { data, getData, error, fetching } = useApiGet();

  useEffect(() => {
    getData('/api/v1/utils/version');
  }, []);

  if (data === undefined) return <></>;

  return (
    <>
      <Stack p={15}>
        <Group justify="space-between">
          <Text fw={700} size="sm">
            Velero Client:
          </Text>
          <Code fw={700}>{data.payload.client.version}</Code>
        </Group>
        <Group justify="space-between">
          <Text fw={700} size="sm">
            Velero Server:
          </Text>
          <Code fw={700}>{data.payload.server.version}</Code>
        </Group>
        {data.payload.warning && (
          <Group>
            <Alert
              variant="outline"
              color="yellow"
              title="Warning"
              icon={<IconAlertTriangle />}
              p={5}
            >
              <Text fw={500} size="xs">
                {data.payload.warning}
              </Text>
            </Alert>
          </Group>
        )}
      </Stack>
    </>
  );
};
