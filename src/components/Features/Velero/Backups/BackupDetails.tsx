'use client';

import { useEffect, useState } from 'react';
import { Card, Grid } from '@mantine/core';
import { useVeleroManifest } from '@/api/Velero/useVeleroManifest';
import { useAgentStatus } from '@/contexts/AgentContext';

import { PageScrollArea } from '@/components/Commons/PageScrollArea';

import Toolbar from '@/components/Display/Toolbar';
import ReloadData from '@/components/Inputs/ReloadData';

import { ResourceLogs } from '@/components/Features/Velero/Logs/ResourceLogs';

import { Manifest } from '@/components/Features/Velero/Commons/Display/Manifest';

import { PVBDetails } from '@/components/Features/Velero/Backups/PVBDetails';
import { BackupDetailsView } from '@/components/Features/Velero/Backups/BackupDetailsView';
import RestoreAction from '@/components/Features/Velero/Backups/Actions/RestoreAction';
import UpdateExpirationAction from '@/components/Features/Velero/Backups/Actions/UpdateExpirationAction';
import DeleteAction from '@/components/Features/Velero/Commons/Actions/DeleteAction';
import { isRecordStringAny } from '@/utils/isRecordStringIsType';
import DownloadAction from '@/components/Features/Velero/Backups/Actions/DownloadAction';
import InspectAction from '@/components/Features/Velero/Backups/Actions/InspectAction';

interface BackupProps {
  params: any;
}

export function BackupDetails({ params }: BackupProps) {
  const { data, getManifest, fetching } = useVeleroManifest();
  const [reload, setReload] = useState(1);
  const agentValues = useAgentStatus();

  const [manifest, setManifest] = useState<Record<string, any>>([]);

  useEffect(() => {
    if (params.backup) {
      getManifest('backup', params.backup, false);
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

        <RestoreAction record={manifest} setReload={setReload} buttonType="button" />
        <InspectAction record={manifest} buttonType="button" />
        <DownloadAction record={manifest} buttonType="button" />
        <UpdateExpirationAction record={manifest} setReload={setReload} buttonType="button" />
        <DeleteAction
          resourceType="backup"
          record={manifest}
          setReload={setReload}
          buttonType="button"
          redirectAfterDelete="/backups"
        />
      </Toolbar>

      <Grid gutter="sm">
        <Grid.Col
          span={{
            base: 12,
            md: 12,
            lg: 4,
          }}
        >
          <BackupDetailsView data={data} fetching={fetching} />
        </Grid.Col>

        <Grid.Col
          span={{
            base: 12,
            md: 12,
            lg: 5,
          }}
        >
          <Card shadow="sm" padding="lg" radius="md" withBorder h={600}>
            <Card.Section withBorder inheritPadding p="sm">
              <Manifest resourceType="backup" resourceName={params.backup} h={570} />
            </Card.Section>
          </Card>
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
