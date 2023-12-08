'use client';

import { Button, Group, Text } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';

import { useApiWithGet } from '@/hooks/useApiWithGet';

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
  const { data, getData, error, fetching } = useApiWithGet();

  function delete_backup() {
    getData(`/api/v1/${resourceType}/delete`, `resource_name=${resourceName}`);

    const interval = setInterval(() => {
      setReload(reload + 1);
      clearInterval(interval);
    }, 3000);
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
