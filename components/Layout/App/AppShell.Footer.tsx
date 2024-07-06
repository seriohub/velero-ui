import { useContext, useEffect } from 'react';

import { usePathname } from 'next/navigation';
import { env } from 'next-runtime-env';

import { Code, Group } from '@mantine/core';

import { useApiGet } from '@/hooks/useApiGet';

import VeleroAppContexts from '@/contexts/VeleroAppContexts';

import { ClusterStatus } from '@/components/ClusterStatus';
import { DiagnosticLink } from '@/components/Diagnostic/DiagnosticLink';
import { ProcessTime } from '@/components/ProcessTime';
import { DiagnosticAgentInfo } from '@/components/Diagnostic/DiagnosticAgentInfo';
import { DiagnosticCoreInfo } from '@/components/Diagnostic/DiagnosticCoreInfo';

export function AppShellFooter() {
  const appValues = useContext(VeleroAppContexts);
  const NEXT_PUBLIC_FRONT_END_BUILD_VERSION = env('NEXT_PUBLIC_FRONT_END_BUILD_VERSION');
  const NEXT_PUBLIC_FRONT_END_BUILD_DATE = env('NEXT_PUBLIC_FRONT_END_BUILD_DATE');
  const { data, getData } = useApiGet();
  const ApiURLenv = appValues.state.currentBackend?.url;
  const pathname = usePathname();

  useEffect(() => {
    getData('/info/get');
  }, [appValues.state.currentBackend]);

  return (
    <>
      <Group justify="space-between" gap={5}>
        <Group gap={5}>
          {appValues.state.isCore && (
          <DiagnosticCoreInfo />
        )}
        { (appValues.state.logged || appValues.state.isCore==false) && (
          <DiagnosticAgentInfo />
        )}
        </Group>

        {pathname != '/' && pathname != '/login' && (
          <Group gap={5}>
            <ClusterStatus />
          </Group>
        )}

        {pathname != '/' && pathname != '/login' && (
          <Group visibleFrom="lg" gap={5}>
            <DiagnosticLink ApiURL={ApiURLenv} />
          </Group>
        )}

        <Group visibleFrom="lg" gap={5}>
          <ProcessTime />
        </Group>

        <Group justify="flex-end" gap={5} visibleFrom="lg">
          {data && data?.payload && (
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
