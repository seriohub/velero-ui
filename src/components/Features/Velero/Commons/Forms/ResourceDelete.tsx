'use client';

import { Button, Group, Text } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';

import { useAppStatus } from '@/contexts/AppContext';
import { useResourceDelete } from '@/api/Velero/useResourceDelete';

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
  const appValues = useAppStatus();
  const { handleDeleteResource } = useResourceDelete();

  function deleteResource() {
    handleDeleteResource(resourceType, { name: resourceName });

    const interval = setInterval(() => {
      setReload(reload + 1);
      clearInterval(interval);
    }, appValues.refreshDatatableAfter);
  }

  return (
    <>
      <Text>
        Confirm delete {resourceType} {resourceName}?
      </Text>
      <Group mt="md" gap="sm" justify="flex-end">
        <Button
          color="red"
          onClick={() => {
            deleteResource();
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
