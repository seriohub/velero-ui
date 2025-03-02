import { Button, Group, Text } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';

import { useRouter } from 'next/navigation';
import { useAppStatus } from '@/contexts/AppContext';
import { useResourceDelete } from '@/api/Velero/useResourceDelete';

interface ResourceDeleteProps {
  resourceType: string;
  resourceName: string;
  setReload: React.Dispatch<React.SetStateAction<number>>;
  redirectAfterDelete: string;
}

export function ResourceDelete({
  resourceType,
  resourceName,
  setReload,
  redirectAfterDelete = '',
}: ResourceDeleteProps) {
  const router = useRouter();
  const appValues = useAppStatus();
  const { handleDeleteResource } = useResourceDelete();

  function deleteResource() {
    handleDeleteResource(resourceType, { name: resourceName }).then(() => {
      if (redirectAfterDelete !== '') {
        router.push(redirectAfterDelete);
      }
    });

    const interval = setInterval(() => {
      setReload((prev) => prev + 1);
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
