import { useEffect } from 'react';

import { env } from 'next-runtime-env';

import { Code, Group } from '@mantine/core';

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

        <Group justify="flex-end" gap={5} visibleFrom="lg">
          {serverValues.isCurrentServerControlPlane && data?.payload && (
            <Code>
              CORE: {data.payload['core_release_version']} ({data.payload['core_release_date']})
            </Code>
          )}
          {!serverValues.isCurrentServerControlPlane && data?.payload && (
            <>
              <Code>
                API: {data.payload['api_release_version']} ({data.payload['api_release_date']})
              </Code>
              <Code>
                Watchdog: {data.payload['watchdog_release_version']} (
                {data.payload['watchdog_release_date']})
              </Code>
            </>
          )}
          <Code>
            UI: {NEXT_PUBLIC_FRONT_END_BUILD_VERSION} ({NEXT_PUBLIC_FRONT_END_BUILD_DATE})
          </Code>
        </Group>
      </Group>
    </>
  );
}
