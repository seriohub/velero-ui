import { Box, Group, Stack } from '@mantine/core';

import { BackupLocation } from '@/components/BackupLocation/data';
import { RepoLocation } from '@/components/Repo/data';
import { SnapshotLocation } from '@/components/SnapshotLocation/data';

export default function ScheduledPage() {
  return (
    <>
      <Stack justify="space-between" h="100%">
        <Box h="35%">
          <Group grow>
            <BackupLocation />
            <SnapshotLocation />
          </Group>
        </Box>
        <Box h="65%">
          <RepoLocation />
        </Box>
      </Stack>
    </>
  );
}
