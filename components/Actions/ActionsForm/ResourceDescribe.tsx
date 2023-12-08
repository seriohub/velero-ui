'use client';

import { useEffect } from 'react';

import { Button, Group } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';

import { useApiWithGet } from '@/hooks/useApiWithGet';
import { Describe } from '@/components/Describe/describe';

interface ResourceDescribeProps {
  resourceType: string;
  resourceName: string;
}

export function ResourceDescribe({ resourceType, resourceName }: ResourceDescribeProps) {
  const { data, getData, error, fetching } = useApiWithGet();

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
