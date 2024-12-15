import { useEffect } from 'react';

import { Alert, Code, Group, Stack, Text, useComputedColorScheme } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

import { useAgentStatus } from '@/contexts/AgentStatusContext';
import { useAppVersion } from '@/api/App/useAppVersion';
import { useUIState } from '@/contexts/UIStateContext';
import { useVeleroTanzuVersion } from '@/api/App/useVeleroTanzuVersion';

export const Version = () => {
  const { data, getAppVersion } = useAppVersion();
  const agentValues = useAgentStatus();
  const computedColorScheme = useComputedColorScheme();
  const uiValues = useUIState();
  const { data: veleroTanzuVersion, getVeleroTanzuVersion } = useVeleroTanzuVersion();

  useEffect(() => {
    if (agentValues.isAgentAvailable) {
      if (process.env.NODE_ENV === 'development')
        console.log(`%cuseEffect 630 has been called`, `color: green; font-weight: bold;`);
      getAppVersion();
      getVeleroTanzuVersion();
    }
  }, [agentValues.isAgentAvailable]);

  if (data === undefined) return <></>;

  return (
    <>
      <Stack p={10} visibleFrom="sm">
        <Group justify="space-between" gap={0}>
          <Text
            fw={400}
            size="sm"
            c={
              computedColorScheme == 'light'
                ? uiValues.navbarColored
                  ? 'white'
                  : undefined
                : undefined
            }
          >
            Velero Client
          </Text>
          <Code fw={700}>{data.payload?.client?.version}</Code>
        </Group>
        <Group justify="space-between" gap={0}>
          <Text
            fw={400}
            size="sm"
            c={
              computedColorScheme == 'light'
                ? uiValues.navbarColored
                  ? 'white'
                  : undefined
                : undefined
            }
          >
            Velero Server
          </Text>
          <Code fw={700}>{data.payload?.server?.version}</Code>
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
        {veleroTanzuVersion?.payload?.velero && (
          <Group justify="space-between" gap={0}>
            <Text
              fw={400}
              size="sm"
              c={
                computedColorScheme == 'light'
                  ? uiValues.navbarColored
                    ? 'white'
                    : undefined
                  : undefined
              }
            >
              Velero Vmware-Tanzu
            </Text>
            <Code fw={700}>
              {veleroTanzuVersion?.payload?.velero.substring(
                0,
                veleroTanzuVersion?.payload?.velero.indexOf(' ')
              )}
            </Code>
          </Group>
        )}
      </Stack>
    </>
  );
};
