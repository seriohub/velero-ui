import { useEffect } from 'react';

import { Alert, Code, Group, Stack, Text, Tooltip, useComputedColorScheme } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

import { useAgentStatus } from '@/contexts/AgentContext';
import { useUIStatus } from '@/contexts/UIContext';

import { useAppVersion } from '@/api/App/useAppVersion';

import { useVeleroTanzuVersion } from '@/api/App/useVeleroTanzuVersion';

export const Version = () => {
  const {
    data,
    getAppVersion
  } = useAppVersion();
  const agentValues = useAgentStatus();
  const computedColorScheme = useComputedColorScheme();
  const uiValues = useUIStatus();
  const {
    data: veleroTanzuVersion,
    getVeleroTanzuVersion
  } = useVeleroTanzuVersion();

  useEffect(() => {
    if (agentValues.isAgentAvailable) {
      getAppVersion();
      getVeleroTanzuVersion();
    }
  }, [agentValues.isAgentAvailable]);

  if (data === undefined) return <></>;

  return (
    <>
      <Stack p={10}>
        <Group justify="space-between" gap={0}>
          <Text
            fw={400}
            size="sm"
            c={
              computedColorScheme === 'light'
                ? uiValues.navbarColored
                  ? 'white'
                  : undefined
                : undefined
            }
          >
            Velero installed
          </Text>
          <Code fw={700}>{data?.toString()}</Code>
        </Group>
        {data && data.warning && (
          <Group>
            <Alert
              variant="outline"
              color="yellow"
              title="Warning"
              icon={<IconAlertTriangle/>}
              p={5}
            >
              <Text fw={500} size="xs">
                {data.warning}
              </Text>
            </Alert>
          </Group>
        )}
        {veleroTanzuVersion?.velero && (
          <Group justify="space-between" gap={0}>
            <Text
              fw={400}
              size="sm"
              c={
                computedColorScheme === 'light'
                  ? uiValues.navbarColored
                    ? 'white'
                    : undefined
                  : undefined
              }
            >
              Velero available
            </Text>
            <Tooltip label={`Latest release ${veleroTanzuVersion?.velero}`}>
              <Code fw={700}>
                {veleroTanzuVersion?.velero.substring(0, veleroTanzuVersion?.velero.indexOf(' '))}
              </Code>
            </Tooltip>
          </Group>
        )}
      </Stack>
    </>
  );
};
