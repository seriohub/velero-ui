'use client';

import { useEffect, useState } from 'react';
import { Card, Grid, Stack } from '@mantine/core';
import { useManifest } from '@/api/Velero/useManifest';
import { useAgentStatus } from '@/contexts/AgentContext';

import Toolbar from '@/components/Toolbar';

import RefreshDatatable from '@/components/Actions/ToolbarActionIcons/RefreshDatatable';

import { PVBSummary } from '@/components/Velero/Backup/PVBSummary';
import { ResourceLogs } from '@/components/Actions/ActionsForm/ResourceLogs';
import { PVBDetails } from '@/components/Velero/Restore/PodDetails';
import { Manifest } from '@/components/Velero/Manifest';
import { PageScrollArea } from '@/components/Velero/PageScrollArea';

interface RestoreProps {
  params: any;
}

export function Restore({ params }: RestoreProps) {
  const { data, getManifest } = useManifest();
  const [reload, setReload] = useState(1);
  const agentValues = useAgentStatus();

  useEffect(() => {
    if (params.restore) {
      getManifest('restores', params.restore);
    }
  }, [agentValues.isAgentAvailable, reload]);

  return (
    <PageScrollArea>
      <Toolbar
        title="Restore"
        breadcrumbItem={[
          {
            name: 'Restores',
            href: '/restores/',
          },
          {
            name: `${params.restore}`,
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
            lg: 3,
          }}
        >
          <PVBDetails data={data} />
        </Grid.Col>

        <Grid.Col
          span={{
            base: 12,
            md: 12,
            lg: 6,
          }}
        >
          <Manifest manifest={data?.payload} />
        </Grid.Col>
        <Grid.Col
          span={{
            base: 12,
            md: 12,
            lg: 3,
          }}
        >
          <PVBSummary backupName={params.restore} />
        </Grid.Col>
      </Grid>

      <Card shadow="sm" mt="md" radius="md" withBorder p={0}>
        <ResourceLogs resourceType="restore" resourceName={data?.payload.metadata.name} />
      </Card>
    </PageScrollArea>
  );
}
