'use client';

import { useEffect, useState } from 'react';
import { Card, Grid, ScrollArea, Stack } from '@mantine/core';
import { useManifest } from '@/api/Velero/useManifest';
import { useAgentStatus } from '@/contexts/AgentContext';

import Toolbar from '@/components/Toolbar';

import RefreshDatatable from '@/components/Actions/ToolbarActionIcons/RefreshDatatable';

import { ScheduleDetails } from '@/components/Velero/Schedule/ScheduleDetails';
import { BackupData } from '@/components/Velero/Backups/Data';
import { Manifest } from '@/components/Velero/Manifest';
import { PageScrollArea } from '@/components/Velero/PageScrollArea';

interface ScheduleProps {
  params: any;
}

export function Schedule({ params }: ScheduleProps) {
  const { data, getManifest } = useManifest();
  const [reload, setReload] = useState(1);
  const agentValues = useAgentStatus();

  useEffect(() => {
    if (params.schedule) {
      getManifest('schedules', params.schedule);
    }
  }, [agentValues.isAgentAvailable]);

  return (
    <PageScrollArea>
      <Toolbar
        title="Schedule"
        breadcrumbItem={[
          {
            name: 'Schedules',
            href: '/schedules/',
          },
          {
            name: `${params.schedule}`,
          },
        ]}
      >
        <RefreshDatatable setReload={setReload} reload={reload} />
      </Toolbar>

      <Grid gutter="sm">
        <Grid.Col
          span={{
            base: 12,
            md: 12,
            lg: 4,
          }}
        >
          <ScheduleDetails data={data} />
        </Grid.Col>

        <Grid.Col
          span={{
            base: 12,
            md: 12,
            lg: 8,
          }}
        >
          <Manifest manifest={data?.payload} />
        </Grid.Col>
      </Grid>

      <Card shadow="sm" mt="sm" radius="md" withBorder h={400} p={0}>
        <BackupData scheduleName={params.schedule} />
      </Card>
    </PageScrollArea>
  );
}
