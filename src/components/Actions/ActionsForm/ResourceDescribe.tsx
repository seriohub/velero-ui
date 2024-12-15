'use client';

import { useEffect } from 'react';

import { Button, Group } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';

import { Describe } from '@/components/Velero/Describe/Describe';
import { useResourceDescribe } from '@/api/Velero/useResourceDescribe';

interface ResourceDescribeProps {
  resourceType: string;
  resourceName: string;
}

export function ResourceDescribe({ resourceType, resourceName }: ResourceDescribeProps) {
  const { data, getResourceDescribe, error, fetching } = useResourceDescribe();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development')
      console.log(`%cuseEffect 230 has been called`, `color: green; font-weight: bold;`);
    getResourceDescribe(resourceType, resourceName);
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
