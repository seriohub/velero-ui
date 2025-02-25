'use client';

import { useEffect, useState } from 'react';
import { Card, Grid } from '@mantine/core';
import { useManifest } from '@/api/Velero/useManifest';
import { useAgentStatus } from '@/contexts/AgentContext';

import { PageScrollArea } from '@/components/Commons/PageScrollArea';

import Toolbar from '@/components/Display/Toolbar';
import ReloadData from '@/components/Inputs/ReloadData';

import { ResourceLogs } from '@/components/Features/Velero/Commons/Forms/ResourceLogs';

import { Manifest } from '@/components/Features/Velero/Commons/Display/Manifest';

import { PVBDetails } from '@/components/Features/Velero/Backups/PVBDetails';
import { BackupDetailsView } from '@/components/Features/Velero/Backups/BackupDetailsView';

interface BackupProps {
  params: any;
}

export function BackupDetails({ params }: BackupProps) {
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
        <ReloadData setReload={setReload} reload={reload} />
      </Toolbar>

      <Grid gutter="sm">
        <Grid.Col
          span={{
            base: 12,
            md: 12,
            lg: 3,
          }}
        >
          <BackupDetailsView data={data} fetching={fetching} />
        </Grid.Col>

        <Grid.Col
          span={{
            base: 12,
            md: 12,
            lg: 6,
          }}
        >
          <Manifest manifest={data} />
        </Grid.Col>
        <Grid.Col
          span={{
            base: 12,
            md: 12,
            lg: 3,
          }}
        >
          <PVBDetails backupName={params.backup} />
        </Grid.Col>
      </Grid>

      <Card shadow="sm" mt="md" radius="md" withBorder p={0}>
        <ResourceLogs resourceType="backup" resourceName={data?.metadata.name} />
      </Card>
    </PageScrollArea>
  );
}
