'use client';

import { useEffect, useState } from 'react';
import { Grid } from '@mantine/core';

import { useAgentStatus } from '@/contexts/AgentContext';

import { useVeleroManifest } from '@/api/Velero/useVeleroManifest';

import { PageScrollArea } from '@/components/Commons/PageScrollArea';

import Toolbar from '@/components/Display/Toolbar';
import ReloadData from '@/components/Inputs/ReloadData';

import { BslDetailsView } from '@/components/Features/Velero/BackupLocations/BslDetailsView';
import { Manifest } from '@/components/Features/Velero/Commons/Display/Manifest';
import DeleteAction from '@/components/Features/Velero/Commons/Actions/DeleteAction';
import { isRecordStringAny } from '@/utils/isRecordStringIsType';

interface BackupProps {
  params: any;
}

export function BslDetails({ params }: BackupProps) {
  const { data, getManifest } = useVeleroManifest();
  const [reload, setReload] = useState(1);
  const agentValues = useAgentStatus();

  const [manifest, setManifest] = useState<Record<string, any>>([]);

  useEffect(() => {
    if (params.bsl) {
      getManifest('backupstoragelocations', params.bsl, false);
    }
  }, [agentValues.isAgentAvailable]);

  useEffect(() => {
    if (isRecordStringAny(data)) {
      setManifest(data);
    } else {
      setManifest([]);
    }
  }, [data]);
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
        <DeleteAction
          resourceType="bsl"
          record={manifest}
          setReload={setReload}
          redirectAfterDelete="/backup-storage-locations"
          buttonType="button"
        />
        <ReloadData setReload={setReload} reload={reload} />
      </Toolbar>

      <Grid gutter="sm">
        <Grid.Col span={4}>
          <BslDetailsView data={data} />
        </Grid.Col>

        <Grid.Col span={8}>
          <Manifest resourceType="backupstoragelocations" resourceName={params.bsl} />
        </Grid.Col>
      </Grid>
    </PageScrollArea>
  );
}
