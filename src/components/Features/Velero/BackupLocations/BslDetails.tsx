'use client';

import { useEffect, useState } from 'react';
import { Card, Grid } from '@mantine/core';

import { useAgentStatus } from '@/contexts/AgentContext';

import { useVeleroManifest } from '@/api/Velero/useVeleroManifest';

import { PageScrollArea } from '@/components/Commons/PageScrollArea';

import Toolbar from '@/components/Display/Toolbar';
import ReloadData from '@/components/Inputs/ReloadData';

import { BslDetailsView } from '@/components/Features/Velero/BackupLocations/BslDetailsView';
import { Manifest } from '@/components/Features/Velero/Commons/Display/Manifest';
import DeleteAction from '@/components/Features/Velero/Commons/Actions/DeleteAction';
import { isRecordStringAny } from '@/utils/isRecordStringIsType';
import EditBslAction from '@/components/Features/Velero/BackupLocations/Actions/EditBSLAction';
import { debounce } from 'lodash';
import { eventEmitter } from '@/lib/EventEmitter.js';
import { useWatchResources } from '@/hooks/useWatchResources';

interface BackupProps {
  params: any;
}

export function BslDetails({ params }: BackupProps) {
  const { data, getManifest } = useVeleroManifest();
  const [reload, setReload] = useState(1);
  const agentValues = useAgentStatus();

  const [manifest, setManifest] = useState<Record<string, any>>([]);

  /* watch */
  useWatchResources('backupstoragelocations');
  const handleWatchResources = debounce((message) => {
    if (
      message?.resources === 'backupstoragelocations' &&
      message?.resource?.metadata?.name === params.bsl
    ) {
      setManifest(message?.resource);
    }
  }, 250);

  useEffect(() => {
    eventEmitter.on('watchResources', handleWatchResources);

    return () => {
      eventEmitter.off('watchResources', handleWatchResources);
    };
  }, []);
  /* end watch */

  useEffect(() => {
    if (params.bsl) {
      getManifest('BackupStorageLocation', params.bsl, false);
    }
  }, [agentValues.isAgentAvailable, reload]);

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
        <ReloadData setReload={setReload} reload={reload} />
        <EditBslAction record={manifest} setReload={setReload} buttonType="button" />
        <DeleteAction
          resourceType="bsl"
          record={manifest}
          setReload={setReload}
          redirectAfterDelete="/backup-storage-locations"
          buttonType="button"
        />
      </Toolbar>

      <Grid gutter="sm">
        <Grid.Col span={4}>
          <BslDetailsView data={manifest} h={600} />
        </Grid.Col>

        <Grid.Col span={8}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h={600}>
            <Card.Section withBorder inheritPadding p="sm">
              <Manifest
                resourceType="BackupStorageLocation"
                resourceName={params.bsl}
                reload={reload}
                h={570}
              />
            </Card.Section>
          </Card>
        </Grid.Col>
      </Grid>
    </PageScrollArea>
  );
}
