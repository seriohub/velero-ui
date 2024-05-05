'use client';

import { Button, Group, Text } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';

import { useApiPost } from '@/hooks/useApiPost';

interface CreateBackupFromScheduleProps {
  scheduleName: string;
}

export function CreateBackupFromSchedule({ scheduleName }: CreateBackupFromScheduleProps) {
  const { postData } = useApiPost();

  function createBackupFromSchedule() {
    postData('/v1/backup/create-from-schedule', { scheduleName: `${scheduleName}` });
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
