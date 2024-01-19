'use client';

import { useEffect } from 'react';

import { Button, Group } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';

import { useApiGet } from '@/hooks/useApiGet';
import { Describe } from '@/components/Describe/Describe';

interface ResourceDescribeProps {
  resourceType: string;
  resourceName: string;
}

export function ResourceDescribe({ resourceType, resourceName }: ResourceDescribeProps) {
  const { data, getData, error, fetching } = useApiGet();

  useEffect(() => {
    getData(`/api/v1/${resourceType}/describe`, `resource_name=${resourceName}`);
  }, [resourceName]);

  return (
    <>
      <Describe items={data !== undefined ? data.payload : []} fetching={fetching} error={error} />
      <Group justify="flex-end">
        <Button onClick={() => closeAllModals()}>Close</Button>
      </Group>
    </>
  );
}
