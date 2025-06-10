import { Button, Center, Group, Text } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';

import { useRouter } from 'next/navigation';
import { useAppStatus } from '@/contexts/AppContext';
import { useResourceDelete } from '@/api/Velero/useResourceDelete';

interface ResourceDeleteProps {
  resourceType: string;
  resourceName: string;
  record: any;
  redirectAfterDelete: string;
}

export function ResourceDelete({
                                 resourceType,
                                 resourceName,
                                 record,
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

    /*const interval = setInterval(() => {
      setReload((prev) => prev + 1);
      clearInterval(interval);
    }, appValues.refreshDatatableAfter);*/
  }

  return (
    <>
      <Center>
        <Text>
          Confirm delete {record?.kind ?? resourceType} {record?.metadata?.name ?? resourceName}?
        </Text>
      </Center>
      <Group mt="md" gap="sm" justify="center">
        <Button color="gray" onClick={() => closeAllModals()}>
          Close
        </Button>
        <Button
          color="red"
          onClick={() => {
            deleteResource();
            closeAllModals();
          }}
        >
          Delete
        </Button>
      </Group>
    </>
  );
}
