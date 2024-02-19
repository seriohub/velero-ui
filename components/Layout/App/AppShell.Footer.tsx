import { useContext, useEffect } from 'react';
import { env } from 'next-runtime-env';
import VeleroAppContexts from '@/contexts/VeleroAppContexts';
import { useApiGet } from '@/hooks/useApiGet';
import { Code, Group } from '@mantine/core';
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
      <Group mx={5} justify="space-between">
        <ClusterInfo />
        {pathname != '/' && pathname != '/login' && <DiagnosticLink ApiURL={ApiURLenv} />}
        <Group justify="flex-end">
          {data && (
            <>
              <Group gap={5}>
                <Code>
                  API: {data['release_version']} ({data['release_date']})
                </Code>
              </Group>
            </>
          )}
          <Group gap={5}>
            <Code>
              UI: {NEXT_PUBLIC_FRONT_END_BUILD_VERSION} ({NEXT_PUBLIC_FRONT_END_BUILD_DATE})
            </Code>
          </Group>
        </Group>
      </Group>
    </>
  );
}
