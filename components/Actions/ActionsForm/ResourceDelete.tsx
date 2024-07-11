'use client';

import { Button, Group, Text } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';

import { useApiGet } from '@/hooks/useApiGet';
import { useAppState } from '@/contexts/AppStateContext';

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
  const appValues = useAppState();
  const { getData } = useApiGet();

  function delete_backup() {
    getData({ url: `/v1/${resourceType}/delete`, param: `resource_name=${resourceName}` });

    const interval = setInterval(() => {
      setReload(reload + 1);
      clearInterval(interval);
    }, appValues.refreshDatatableAfter);
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
