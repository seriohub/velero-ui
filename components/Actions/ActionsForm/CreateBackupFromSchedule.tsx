'use client';

import { Button, Group, Text } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';

import { useApiWithPost } from '@/hooks/useApiWithPost';

interface CreateBackupFromScheduleProps {
  scheduleName: string;
}

export function CreateBackupFromSchedule({ scheduleName }: CreateBackupFromScheduleProps) {
  const { data, postData, error, fetching } = useApiWithPost();

  function createBackupFromSchedule() {
    postData('/api/v1/backup/create-from-schedule', { scheduleName: `${scheduleName}` });
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
