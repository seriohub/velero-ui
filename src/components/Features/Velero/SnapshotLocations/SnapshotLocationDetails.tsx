'use client';

import { useEffect, useState } from 'react';
import { Card, Grid } from '@mantine/core';

import { useAgentStatus } from '@/contexts/AgentContext';

import { useVeleroManifest } from '@/api/Velero/useVeleroManifest';

import { PageScrollArea } from '@/components/Commons/PageScrollArea';
import Toolbar from '@/components/Display/Toolbar';
import ReloadData from '@/components/Inputs/ReloadData';

import { SnapshotLocationDetailsView } from '@/components/Features/Velero/SnapshotLocations/SnapshotLocationDetailsView';
import { Manifest } from '@/components/Features/Velero/Commons/Display/Manifest';
import DeleteAction from '@/components/Features/Velero/Commons/Actions/DeleteAction';
import { isRecordStringAny } from '@/utils/isRecordStringIsType';
import EditVslAction from '@/components/Features/Velero/SnapshotLocations/Actions/EditVSLAction';

interface BackupProps {
  params: any;
}

export function SnapshotLocationDetails({ params }: BackupProps) {
  const { data, getManifest } = useVeleroManifest();
  const [reload, setReload] = useState(1);
  const agentValues = useAgentStatus();

  const [manifest, setManifest] = useState<Record<string, any>>([]);

  useEffect(() => {
    if (params.vsl) {
      getManifest('VolumeSnapshotLocation', params.vsl, false);
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
        <EditVslAction record={manifest} setReload={setReload} buttonType="button" />
        <DeleteAction
          resourceType="vsl"
          record={manifest}
          setReload={setReload}
          redirectAfterDelete="/volume-snapshot-locations"
          buttonType="button"
        />
      </Toolbar>
      <Grid gutter="sm">
        <Grid.Col span={4}>
          <SnapshotLocationDetailsView data={manifest} />
        </Grid.Col>

        <Grid.Col span={8}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h={600}>
            <Card.Section withBorder inheritPadding p="sm">
              <Manifest
                resourceType="VolumeSnapshotLocation"
                resourceName={params.vsl}
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
