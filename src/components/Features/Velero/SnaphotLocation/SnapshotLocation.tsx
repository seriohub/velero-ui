'use client';

import { useEffect, useState } from 'react';
import { Grid } from '@mantine/core';

import { useAgentStatus } from '@/contexts/AgentContext';

import { useManifest } from '@/api/Velero/useManifest';

import { PageScrollArea } from '@/components/Commons/PageScrollArea';
import Toolbar from '@/components/Display/Toolbar';
import ReloadData from '@/components/Inputs/ReloadData';

import { Details } from '@/components/Features/Velero/SnaphotLocation/Details';
import { Manifest } from '@/components/Features/Velero/Commons/Display/Manifest';

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
        <ReloadData setReload={setReload} reload={reload} />
      </Toolbar>
      <Grid gutter="sm">
        <Grid.Col span={4}>
          <Details data={data} />
        </Grid.Col>

        <Grid.Col span={8}>
          <Manifest manifest={data} />
        </Grid.Col>
      </Grid>
    </PageScrollArea>
  );
}
