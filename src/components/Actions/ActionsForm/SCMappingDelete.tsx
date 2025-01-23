'use client';

import { Button, Group, Text } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';
import { useAppStatus } from '@/contexts/AppContext';
import { useSCDelete } from '@/api/SCMapping/useSCDelete';

interface SCMappingDeleteProps {
  record: any;
  reload: number;
  setReload: any;
}

export function SCMappingDelete({ record, reload, setReload }: SCMappingDeleteProps) {
  const appValues = useAppStatus();
  const { handleDeleteSCMap } = useSCDelete();

  function deleteSCMap() {
    handleDeleteSCMap({
      oldStorageClass: record['oldStorageClass'],
      newStorageClass: record['newStorageClass'],
    });

    const interval = setInterval(() => {
      setReload(reload + 1);
      clearInterval(interval);
    }, appValues.refreshDatatableAfter);
  }

  return (
    <>
      <Text>
        Confirm delete Storage Mapping {record['oldStorageClass']}:{record['newStorageClass']}?
      </Text>
      <Group mt="md" gap="sm" justify="flex-end">
        <Button
          color="red"
          onClick={() => {
            deleteSCMap();
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
