'use client';

import React, { useContext, useEffect, useState } from 'react';

import { Stack, Group, Grid, Loader, Center, ScrollArea, SimpleGrid, Space } from '@mantine/core';

import { IconClock, IconDeviceFloppy, IconRestore, IconCalendarEvent } from '@tabler/icons-react';
import { useViewportSize } from '@mantine/hooks';
import { useApiGet } from '@/hooks/useApiGet';
import { StatsSegments } from './items/StatsSegments';
import { UnscheduledNamespaces } from './items/UnscheduledNamspaces';
import { BackupLatest } from '../Backup/Latest';
import Toolbar from '../Toolbar';
import RefreshDatatable from '../Actions/ToolbarActionIcons/RefreshDatatable';

export function Dashboard() {
  const { height: vpHeight, width: vpWidth } = useViewportSize();
  const { data, getData } = useApiGet();
  const [reload, setReload] = useState(1);

  //useEffect(() => {
  //  getData('/v1/stats/get');
  //}, []);

  useEffect(() => {
    getData({url:'/v1/stats/get'});
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
      <ScrollArea p={0} style={{ height: '100%' }} scrollbars="y" offsetScrollbars>
        <Stack p={5} w={vpWidth < 768 ? '100vw' : 'calc(100vw - 240px)'}>
          <Stack>
            <Toolbar title="Dashboard">
              <RefreshDatatable setReload={setReload} reload={reload} />
            </Toolbar>
            <SimpleGrid
              cols={{ base: 1, sm: 3, lg: 5 }}
              spacing={{ base: 5, sm: 10 }}
              verticalSpacing={{ base: 'md', sm: 'xl' }}
            >
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
              <UnscheduledNamespaces
                namespaces={data.payload?.namespaces?.unscheduled}
                total={data.payload?.namespaces?.total}
              />
            </SimpleGrid>
          </Stack>
        </Stack>
        <Space h={20}/>
        <BackupLatest latest={data.payload.backups.latest} reload={reload} setReload={setReload} />
      </ScrollArea>
    </>
  );
}
