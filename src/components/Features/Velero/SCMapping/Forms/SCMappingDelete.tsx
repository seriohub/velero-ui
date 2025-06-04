import { Button, Group, Text } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';

import { useAppStatus } from '@/contexts/AppContext';
import { useSCDelete } from '@/api/SCMapping/useSCDelete';

interface SCMappingDeleteProps {
  record: any;
  setReload: React.Dispatch<React.SetStateAction<number>>;
}

export function SCMappingDelete({
                                  record,
                                  setReload
                                }: SCMappingDeleteProps) {
  const appValues = useAppStatus();
  const { handleDeleteSCMap } = useSCDelete();

  function deleteSCMap() {
    handleDeleteSCMap({
      oldStorageClass: record.oldStorageClass,
      newStorageClass: record.newStorageClass,
    });

    const interval = setInterval(() => {
      setReload(prev => prev + 1);
      clearInterval(interval);
    }, appValues.refreshDatatableAfter);
  }

  return (
    <>
      <Text>
        Confirm delete Storage Mapping {record.oldStorageClass}:{record.newStorageClass}?
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
