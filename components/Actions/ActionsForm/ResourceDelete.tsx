'use client';

import { Button, Group, Text } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';
import { useContext } from 'react';

import { useApiGet } from '@/hooks/useApiGet';
import VeleroAppContexts from '@/contexts/VeleroAppContexts';

interface ResourceDeleteProps {
  resourceType: string;
  resourceName: string;
  reload: number;
  setReload: any;
}

export function ResourceDelete({
  resourceType,
  resourceName,
  reload,
  setReload,
}: ResourceDeleteProps) {
  const appValues = useContext(VeleroAppContexts);
  const { getData } = useApiGet();

  function delete_backup() {
    getData(`/v1/${resourceType}/delete`, `resource_name=${resourceName}`);

    const interval = setInterval(() => {
      setReload(reload + 1);
      clearInterval(interval);
    }, appValues.state.refreshDatatableAfter);
  }

  return (
    <>
      <Text>Confirm delete backup {resourceName}?</Text>
      <Group mt="md" gap="sm" justify="flex-end">
        <Button
          color="red"
          onClick={() => {
            delete_backup();
            closeAllModals();
          }}
        >
          Delete
        </Button>
        <Button variant="transparent" c="dimmed" onClick={() => closeAllModals()}>
          Close
        </Button>
      </Group>
    </>
  );
}
