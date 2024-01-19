'use client';

import { useState } from 'react';

import { Button, Group, Text, TextInput } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';

import { useApiPost } from '@/hooks/useApiPost';

interface RestoreBackupProps {
  resourceType: string;
  resourceName: string;
  reload: number;
  setReload: any;
}

export function RestoreBackup({
  resourceType,
  resourceName,
  reload,
  setReload,
}: RestoreBackupProps) {
  const { postData } = useApiPost();
  const [parameters, setParamaters] = useState('');

  function restore_backup() {
    postData('/api/v1/restore/create', {
      resource_name: `${resourceName}`,
      resource_type: `${resourceType}`,
      parameters,
    });
    setReload(reload + 1);
  }

  return (
    <>
      <Text>
        Confirm restore backup {resourceName} from {resourceType}?
      </Text>
      <TextInput
        label="Add parameters"
        placeholder="Input parameters"
        value={parameters}
        onChange={(e) => setParamaters(e.currentTarget.value)}
      />
      <Group mt="md" gap="sm" justify="flex-end">
        <Button
          color="green"
          onClick={() => {
            restore_backup();
            closeAllModals();
          }}
        >
          Restore
        </Button>
        <Button variant="transparent" c="dimmed" onClick={() => closeAllModals()}>
          Close
        </Button>
      </Group>
    </>
  );
}
