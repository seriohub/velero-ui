'use client';

import { Button, Group, Text } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';

import { useCreateBackupFromScheule } from '@/api/Backup/useCreateBackupFromScheule';

interface CreateBackupFromScheduleProps {
  scheduleName: string;
}

export function CreateBackupFromScheduleForm({ scheduleName }: CreateBackupFromScheduleProps) {
  const { handleCreateBackupFromSchedule } = useCreateBackupFromScheule();

  function createBackupFromSchedule() {
    handleCreateBackupFromSchedule(scheduleName);
  }

  return (
    <>
      <Text>Create backup from {scheduleName}?</Text>
      <Group mt="md" gap="sm" justify="flex-end">
        <Button
          color="green"
          onClick={() => {
            createBackupFromSchedule();
            closeAllModals();
          }}
        >
          Create
        </Button>
        <Button variant="transparent" c="dimmed" onClick={() => closeAllModals()}>
          Close
        </Button>
      </Group>
    </>
  );
}
