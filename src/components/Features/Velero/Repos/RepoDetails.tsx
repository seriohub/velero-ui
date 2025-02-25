'use client';

import { useEffect, useState } from 'react';
import { Grid } from '@mantine/core';
import { useManifest } from '@/api/Velero/useManifest';
import { useAgentStatus } from '@/contexts/AgentContext';

import { PageScrollArea } from '@/components/Commons/PageScrollArea';

import Toolbar from '@/components/Display/Toolbar';
import ReloadData from '@/components/Inputs/ReloadData';
import { DetailsView } from '@/components/Features/Velero/Repos/DetailsView';
import { Manifest } from '@/components/Features/Velero/Commons/Display/Manifest';

interface BackupProps {
  params: any;
}

export function RepoDetails({ params }: BackupProps) {
  // console.log('---', params.backup);
  const { data, getManifest } = useManifest();
  const [reload, setReload] = useState(1);
  const agentValues = useAgentStatus();

  useEffect(() => {
    if (params.repo) {
      getManifest('backuprepositories', params.repo);
    }
  }, [agentValues.isAgentAvailable]);

  return (
    <PageScrollArea>
      <Toolbar
        title="Volume Snapshot Locations"
        breadcrumbItem={[
          {
            name: 'Backup Repository',
            href: '/repos/',
          },
          {
            name: `${params.repo}`,
          },
        ]}
      >
        <ReloadData setReload={setReload} reload={reload} />
      </Toolbar>
      <Grid gutter="sm">
        <Grid.Col span={4}>
          <DetailsView data={data} />
        </Grid.Col>

        <Grid.Col span={8}>
          <Manifest manifest={data} />
        </Grid.Col>
      </Grid>
    </PageScrollArea>
  );
}
