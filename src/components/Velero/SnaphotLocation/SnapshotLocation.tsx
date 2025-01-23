'use client';

import { useEffect, useState } from 'react';
import { Grid, Stack } from '@mantine/core';
import { useManifest } from '@/api/Velero/useManifest';
import { useAgentStatus } from '@/contexts/AgentContext';

import Toolbar from '@/components/Toolbar';

import RefreshDatatable from '@/components/Actions/ToolbarActionIcons/RefreshDatatable';
import { Details } from '@/components/Velero/SnaphotLocation/Details';
import { Manifest } from '@/components/Velero/Manifest';
import { PageScrollArea } from '@/components/Velero/PageScrollArea';

interface BackupProps {
  params: any;
}

export function SnapshotLocation({ params }: BackupProps) {
  // console.log('---', params.backup);
  const { data, getManifest } = useManifest();
  const [reload, setReload] = useState(1);
  const agentValues = useAgentStatus();

  useEffect(() => {
    if (params.vsl) {
      getManifest('volumesnapshotlocations', params.vsl);
    }
  }, [agentValues.isAgentAvailable]);

  return (
    <PageScrollArea>
      <Toolbar
        title="Volume Snapshot Locations"
        breadcrumbItem={[
          {
            name: 'Volume Snapshot  Locations',
            href: '/volume-snapshot-locations/',
          },
          {
            name: `${params.vsl}`,
          },
        ]}
      >
        <RefreshDatatable setReload={setReload} reload={reload} />
      </Toolbar>
      <Grid gutter="sm">
        <Grid.Col span={4}>
          <Details data={data} />
        </Grid.Col>

        <Grid.Col span={8}>
          <Manifest manifest={data?.payload} />
        </Grid.Col>
      </Grid>
    </PageScrollArea>
  );
}
