'use client';

import React, { useEffect, useState } from 'react';

import { Stack, Group, Grid, Loader, Center } from '@mantine/core';

import { IconClock, IconDeviceFloppy, IconRestore, IconCalendarEvent } from '@tabler/icons-react';

import { useApiGet } from '@/hooks/useApiGet';
import { StatsSegments } from './items/StatsSegments';
import { UnscheduledNamespaces } from './items/UnscheduledNamspaces';
import { BackupLatest } from '../Backup/Latest';
import Toolbar from '../Toolbar';
import RefreshDatatable from '../Actions/ToolbarActionIcons/RefreshDatatable';

export function Dashboard() {
  const { data, getData } = useApiGet();
  const [reload, setReload] = useState(1);

  useEffect(() => {
    getData('/api/v1/stats/get');
  }, []);

  useEffect(() => {
    getData('/api/v1/stats/get');
  }, [reload]);

  if (data === undefined) {
    return (
      <Stack h="100%" justify="center">
        <Center>
          <Loader color="blue" />
        </Center>
      </Stack>
    );
  }

  return (
    <>
      <Stack h="100%" gap={15}>
        <Stack>
          <Toolbar title="Dashboard">
            <RefreshDatatable setReload={setReload} reload={reload} />
          </Toolbar>
          <Group grow>
            <StatsSegments
              data={data.payload.backups.stats.all}
              title="Backups"
              icon={<IconDeviceFloppy />}
            />
            <StatsSegments
              data={data.payload.backups.stats.latest}
              title="Last Schedule Backups"
              icon={<IconClock />}
            />
            <StatsSegments
              data={data.payload.restores.all}
              title="Restores"
              icon={<IconRestore />}
            />
            <StatsSegments
              data={data.payload.schedules.all}
              title="Schedules"
              icon={<IconCalendarEvent />}
            />
          </Group>
        </Stack>

        <Grid>
          <Grid.Col span={2}>
            <UnscheduledNamespaces namespaces={data.payload?.namespaces?.unscheduled} />
          </Grid.Col>
          <Grid.Col span={10}>
            <BackupLatest
              latest={data.payload.backups.latest}
              reload={reload}
              setReload={setReload}
            />
          </Grid.Col>
        </Grid>
      </Stack>
    </>
  );
}
