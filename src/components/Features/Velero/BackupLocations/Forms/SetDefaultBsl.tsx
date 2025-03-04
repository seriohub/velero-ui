import { Button, Group, Text } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';

import { useAppStatus } from '@/contexts/AppContext';
import { useDefaultBsl } from '@/api/BackupLocation/useDefaultBsl';

interface ResourceDeleteProps {
  name: string;
  reload: number;
  setReload: React.Dispatch<React.SetStateAction<number>>;
  def: boolean;
}

export function SetDefaultBsl({ name, reload, setReload, def }: ResourceDeleteProps) {
  const appValues = useAppStatus();
  const { handleDefaultBsl } = useDefaultBsl();

  function deleteResource() {
    handleDefaultBsl({
      name,
      default: def,
    });

    const interval = setInterval(() => {
      setReload(reload + 1);
      clearInterval(interval);
    }, appValues.refreshDatatableAfter);
  }

  return (
    <>
      <Text>
        {def
          ? `Set default ${name} as default Backup Storage Location?`
          : `Remove ${name} as default Backup Storage Location?`}
      </Text>
      <Group mt="md" gap="sm" justify="flex-end">
        <Button
          // color="green"
          onClick={() => {
            deleteResource();
            closeAllModals();
          }}
        >
          Confirm
        </Button>
        <Button variant="transparent" c="dimmed" onClick={() => closeAllModals()}>
          Close
        </Button>
      </Group>
    </>
  );
}
