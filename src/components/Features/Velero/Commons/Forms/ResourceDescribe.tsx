'use client';

import { useEffect } from 'react';

import { Button, Group } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';

import { Describe } from '@/components/Features/Velero/Commons/Display/Describe';
import { useResourceDescribe } from '@/api/Velero/useResourceDescribe';

interface ResourceDescribeProps {
  resourceType: string;
  resourceName: string;
}

function isJSONObject(variable: any) {
  return typeof variable === 'object' && variable !== null && !Array.isArray(variable);
}

export function ResourceDescribe({ resourceType, resourceName }: ResourceDescribeProps) {
  const { data, getResourceDescribe, error, fetching } = useResourceDescribe();

  useEffect(() => {
    getResourceDescribe(resourceType, resourceName);
  }, [resourceName]);

  return (
    <>
      <Describe
        items={data !== undefined && isJSONObject(data) ? data : {}}
        fetching={fetching}
        error={error}
      />
      <Group justify="flex-end">
        <Button onClick={() => closeAllModals()}>Close</Button>
      </Group>
    </>
  );
}
