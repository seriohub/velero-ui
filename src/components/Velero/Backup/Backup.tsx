'use client';

import { useEffect, useState } from 'react';
import { Card, Grid } from '@mantine/core';
import { useManifest } from '@/api/Velero/useManifest';
import { useAgentStatus } from '@/contexts/AgentContext';

import Toolbar from '@/components/Toolbar';

import RefreshDatatable from '@/components/Actions/ToolbarActionIcons/RefreshDatatable';

import { PVBSummary } from '@/components/Velero/Backup/PVBSummary';
import { ResourceLogs } from '@/components/Actions/ActionsForm/ResourceLogs';
import { Details } from '@/components/Velero/Backup/Details';
import { Manifest } from '@/components/Velero/Manifest';
import { PageScrollArea } from '@/components/Velero/PageScrollArea';

interface BackupProps {
  params: any;
}

export function Backup({ params }: BackupProps) {
  const { data, getManifest, fetching } = useManifest();
  const [reload, setReload] = useState(1);
  const agentValues = useAgentStatus();

  useEffect(() => {
    if (params.backup) {
      getManifest('backups', params.backup);
    }
  }, [agentValues.isAgentAvailable, reload]);

  return (
    <PageScrollArea>
      <Toolbar
        title="Backup"
        breadcrumbItem={[
          {
            name: 'Backups',
            href: '/backups/',
          },
          {
            name: `${params.backup}`,
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
          <Details data={data} fetching={fetching} />
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
          <PVBSummary backupName={params.backup} />
        </Grid.Col>
      </Grid>

      <Card shadow="sm" mt="md" radius="md" withBorder p={0}>
        <ResourceLogs resourceType="backup" resourceName={data?.payload.metadata.name} />
      </Card>
    </PageScrollArea>
  );
}
