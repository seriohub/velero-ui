'use client';

import { useEffect, useState } from 'react';
import { Card, Grid } from '@mantine/core';
import { useManifest } from '@/api/Velero/useManifest';
import { useAgentStatus } from '@/contexts/AgentContext';

import Toolbar from '@/components/Display/Toolbar';
import ReloadData from '@/components/Inputs/ReloadData';

import { PageScrollArea } from '@/components/Commons/PageScrollArea';

import { ScheduleDetailsView } from '@/components/Features/Velero/Schedules/ScheduleDetailsView';
import { Manifest } from '@/components/Features/Velero/Commons/Display/Manifest';
import { BackupsDatatable } from '@/components/Features/Velero/Backups/BackupsDatatable';

interface ScheduleProps {
  params: any;
}

export function ScheduleDetails({ params }: ScheduleProps) {
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
        <ReloadData setReload={setReload} reload={reload} />
      </Toolbar>

      <Grid gutter="sm">
        <Grid.Col
          span={{
            base: 12,
            md: 12,
            lg: 4,
          }}
        >
          <ScheduleDetailsView data={data} />
        </Grid.Col>

        <Grid.Col
          span={{
            base: 12,
            md: 12,
            lg: 8,
          }}
        >
          <Manifest manifest={data} />
        </Grid.Col>
      </Grid>

      <Card shadow="sm" mt="sm" radius="md" withBorder h={400} p={0}>
        <BackupsDatatable scheduleName={params.schedule} />
      </Card>
    </PageScrollArea>
  );
}
