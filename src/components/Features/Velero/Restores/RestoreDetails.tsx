'use client';

import { useEffect, useState } from 'react';
import { Card, Grid } from '@mantine/core';

import { useManifest } from '@/api/Velero/useManifest';

import { useAgentStatus } from '@/contexts/AgentContext';

import { PageScrollArea } from '@/components/Commons/PageScrollArea';

import Toolbar from '@/components/Display/Toolbar';
import ReloadData from '@/components/Inputs/ReloadData';

import { ResourceLogs } from '@/components/Features/Velero/Commons/Forms/ResourceLogs';
import { PVBDetails } from '@/components/Features/Velero/Restores/PodDetails';
import { Manifest } from '@/components/Features/Velero/Commons/Display/Manifest';

interface RestoreProps {
  params: any;
}

export function RestoreDetails({ params }: RestoreProps) {
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
          <PVBDetails data={data} />
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
          <PVBDetails backupName={params.restore} />
        </Grid.Col>
      </Grid>

      <Card shadow="sm" mt="md" radius="md" withBorder p={0}>
        <ResourceLogs resourceType="restore" resourceName={data?.metadata.name} />
      </Card>
    </PageScrollArea>
  );
}
