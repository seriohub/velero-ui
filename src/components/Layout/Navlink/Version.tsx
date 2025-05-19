'use client';

import { Alert, Code, Group, Stack, Text, Tooltip, useComputedColorScheme } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useAgentStatus } from '@/contexts/AgentContext';
import { useUIStatus } from '@/contexts/UIContext';
import { useAppVersion } from '@/api/App/useAppVersion';
import { useAppStatus } from "@/contexts/AppContext";

export const Version = () => {
  const {
    data,
    getAppVersion
  } = useAppVersion();

  const agentValues = useAgentStatus();
  const computedColorScheme = useComputedColorScheme();
  const uiValues = useUIStatus();
  const appValues = useAppStatus();

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
          <Code fw={700}>{agentValues.veleroInstalledVersion}</Code>
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
        {appValues?.veleroTanzuVersion?.velero && (
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
            <Tooltip label={`Latest release ${appValues?.veleroTanzuVersion?.velero}`}>
              <Code fw={700}>
                {appValues?.veleroTanzuVersion?.velero.substring(0, appValues?.veleroTanzuVersion?.velero.indexOf(' '))}
              </Code>
            </Tooltip>
          </Group>
        )}
      </Stack>
    </>
  );
};
