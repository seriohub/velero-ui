import { useContext, useEffect } from 'react';
import { env } from 'next-runtime-env';
import VeleroAppContexts from '@/contexts/VeleroAppContexts';
import { useApiGet } from '@/hooks/useApiGet';
import { Box, Code, Group } from '@mantine/core';
import { ClusterInfo } from '@/components/ClusterInfo';
import { DiagnosticLink } from '@/components/DiagnosticLink';
import { usePathname } from 'next/navigation';

export function AppShellFooter() {
  const value = useContext(VeleroAppContexts);
  const NEXT_PUBLIC_FRONT_END_BUILD_VERSION = env('NEXT_PUBLIC_FRONT_END_BUILD_VERSION');
  const NEXT_PUBLIC_FRONT_END_BUILD_DATE = env('NEXT_PUBLIC_FRONT_END_BUILD_DATE');
  const { data, getData } = useApiGet();
  const ApiURLenv = env('NEXT_PUBLIC_VELERO_API_URL') || '';
  const pathname = usePathname();

  useEffect(() => {
    getData('/info/get');
  }, []);

  return (
    <>
      <Group justify="space-between" gap={5}>
        <ClusterInfo />
        <Box visibleFrom="lg">
          {pathname != '/' && pathname != '/login' && <DiagnosticLink ApiURL={ApiURLenv} />}
        </Box>
        <Group justify="flex-end" gap={5} visibleFrom="lg">
          {data && data?.payload && (
            <>
              <Code>
                API: {data.payload['api_release_version']} ({data.payload['api_release_date']})
              </Code>
              <Code>
                Watchdog: {data.payload['watchdog_release_version']} ({data.payload['watchdog_release_date']})
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
