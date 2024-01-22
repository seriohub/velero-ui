'use client';

import { Box, Grid, Stack } from '@mantine/core';

import { BackupLocation } from '@/components/BackupLocation/Data';
import { RepoLocation } from '@/components/Repo/Data';
import { SnapshotLocation } from '@/components/SnapshotLocation/Data';

export default function ScheduledPage() {
  return (
    <>
      <Stack justify="space-between" h="100%">
        <Box h="35%">
          <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>
            <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
              <BackupLocation />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
              <SnapshotLocation />
            </Grid.Col>
          </Grid>
        </Box>
        <Box h="65%">
          <RepoLocation />
        </Box>
      </Stack>
    </>
  );
}
