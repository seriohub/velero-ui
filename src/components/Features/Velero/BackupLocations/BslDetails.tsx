'use client';

import { useEffect, useState } from 'react';
import { Grid } from '@mantine/core';

import { useAgentStatus } from '@/contexts/AgentContext';

import { useManifest } from '@/api/Velero/useManifest';

import { PageScrollArea } from '@/components/Commons/PageScrollArea';

import Toolbar from '@/components/Display/Toolbar';
import ReloadData from '@/components/Inputs/ReloadData';

import { BslDetailsView } from '@/components/Features/Velero/BackupLocations/BslDetailsView';
import { Manifest } from '@/components/Features/Velero/Commons/Display/Manifest';

interface BackupProps {
  params: any;
}

export function BslDetails({ params }: BackupProps) {
  const { data, getManifest } = useManifest();
  const [reload, setReload] = useState(1);
  const agentValues = useAgentStatus();

  useEffect(() => {
    if (params.bsl) {
      getManifest('backupstoragelocations', params.bsl);
    }
  }, [agentValues.isAgentAvailable]);

  return (
    <PageScrollArea>
      <Toolbar
        title="Backup Storage Locations"
        breadcrumbItem={[
          {
            name: 'Backup Storage Locations',
            href: '/backup-storage-locations/',
          },
          {
            name: `${params.bsl}`,
          },
        ]}
      >
        <ReloadData setReload={setReload} reload={reload} />
      </Toolbar>

      <Grid gutter="sm">
        <Grid.Col span={4}>
          <BslDetailsView data={data} />
        </Grid.Col>

        <Grid.Col span={8}>
          <Manifest manifest={data} />
        </Grid.Col>
      </Grid>
    </PageScrollArea>
  );
}
