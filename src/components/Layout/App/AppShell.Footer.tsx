import { useEffect } from 'react';

import { env } from 'next-runtime-env';

import { Code, Group, Text, Tooltip } from '@mantine/core';

import { useAppState } from '@/contexts/AppStateContext';

import { ProcessTime } from '@/components/ProcessTime';
import { DiagnosticAgentInfo } from '@/components/Diagnostic/DiagnosticAgentInfo';
import { DiagnosticCoreInfo } from '@/components/Diagnostic/DiagnosticCoreInfo';
import { useServerStatus } from '@/contexts/ServerStatusContext';
import { useAgentStatus } from '@/contexts/AgentStatusContext';
import { useAppInfo } from '@/api/App/useAppInfo';

export function AppShellFooter() {
  const appValues = useAppState();
  const agentValues = useAgentStatus();
  const serverValues = useServerStatus();

  const NEXT_PUBLIC_FRONT_END_BUILD_VERSION = env('NEXT_PUBLIC_FRONT_END_BUILD_VERSION');
  const NEXT_PUBLIC_FRONT_END_BUILD_DATE = env('NEXT_PUBLIC_FRONT_END_BUILD_DATE');
  const { data, getAppInfo } = useAppInfo();

  useEffect(() => {
    if (agentValues.isAgentAvailable)
      if (process.env.NODE_ENV === 'development')
        console.log(`%cuseEffect 550 has been called`, `color: green; font-weight: bold;`);

    getAppInfo(serverValues.isCurrentServerControlPlane ? 'core' : 'agent');
  }, [agentValues.isAgentAvailable]);

  useEffect(() => {
    appValues.setBackendInfo(data?.payload);
  });
  return (
    <>
      <Group justify="space-between" gap={5}>
        <Group gap={20}>
          {serverValues.isCurrentServerControlPlane && <DiagnosticCoreInfo />}
          {(appValues.isAuthenticated || serverValues.isCurrentServerControlPlane == false) && (
            <DiagnosticAgentInfo />
          )}
        </Group>

        <Group visibleFrom="lg" gap={5}>
          <ProcessTime />
        </Group>

        <Group justify="flex-end" gap={10} visibleFrom="lg">
          {serverValues.isCurrentServerControlPlane && data?.payload && (
            <Code>
              CORE: {data.payload['core_release_version']} ({data.payload['core_release_date']})
            </Code>
          )}
          {!serverValues.isCurrentServerControlPlane && data?.payload && (
            <>
              <Group gap={5}>
                <Text size="sm">API</Text>
                <Tooltip label={`Release date ${data.payload['api_release_date']}`}>
                <Code fw={700}>
                  {data.payload['api_release_version']}
                </Code>
                </Tooltip>
              </Group>
              <Group gap={5}>
                <Text size="sm">Watchdog</Text>
                <Tooltip label={`Release date ${data.payload['watchdog_release_date']}`}>
                <Code fw={700}>
                  {data.payload['watchdog_release_version']}
                </Code>
                </Tooltip>
              </Group>
            </>
          )}
          <Group gap={5}>
            <Text size="sm">UI</Text>
            <Tooltip label={`Release date ${NEXT_PUBLIC_FRONT_END_BUILD_DATE}`}>
            <Code fw={700}>
              {NEXT_PUBLIC_FRONT_END_BUILD_VERSION}
            </Code>
            </Tooltip>
          </Group>
        </Group>
      </Group>
    </>
  );
}
