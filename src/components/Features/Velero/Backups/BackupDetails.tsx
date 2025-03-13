'use client';

import { useEffect, useState } from 'react';
import { Card, Grid, Tabs } from '@mantine/core';
import { debounce } from 'lodash';
import { IconDatabaseExport, IconFileText } from '@tabler/icons-react';
import { useVeleroManifest } from '@/api/Velero/useVeleroManifest';
import { useAgentStatus } from '@/contexts/AgentContext';

import { PageScrollArea } from '@/components/Commons/PageScrollArea';

import Toolbar from '@/components/Display/Toolbar';
import ReloadData from '@/components/Inputs/ReloadData';

import { ResourceLogs } from '@/components/Features/Velero/Logs/ResourceLogs';

import { Manifest } from '@/components/Features/Velero/Commons/Display/Manifest';

import { PodVolumeList } from '@/components/Features/Velero/PodVolumes/PodVolumeList';
import { BackupDetailsView } from '@/components/Features/Velero/Backups/BackupDetailsView';
import RestoreAction from '@/components/Features/Velero/Backups/Actions/RestoreAction';
import UpdateExpirationAction from '@/components/Features/Velero/Backups/Actions/UpdateExpirationAction';
import DeleteAction from '@/components/Features/Velero/Commons/Actions/DeleteAction';
import { isRecordStringAny } from '@/utils/isRecordStringIsType';
import DownloadAction from '@/components/Features/Velero/Backups/Actions/DownloadAction';
import InspectAction from '@/components/Features/Velero/Backups/Actions/InspectAction';
import { eventEmitter } from '@/lib/EventEmitter.js';

interface BackupProps {
  params: any;
}

export function BackupDetails({ params }: BackupProps) {
  const { data, getManifest } = useVeleroManifest();
  const [reload, setReload] = useState(1);
  const agentValues = useAgentStatus();

  const [manifest, setManifest] = useState<Record<string, any>>([]);

  /* watch */
  // useWatchResources('backups');
  const handleWatchResources = debounce((message) => {
    if (message?.resources === 'backups' && message?.resource?.metadata?.name === params.backup) {
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
          <BackupDetailsView data={manifest} h={550} />
        </Grid.Col>

        <Grid.Col
          span={{
            base: 12,
            md: 12,
            lg: 8,
          }}
        >
          <Card shadow="sm" padding="lg" radius="md" withBorder h={550}>
            <Card.Section withBorder inheritPadding p="sm">
              <Manifest resourceType="Backup" resourceName={params.backup} h={530} />
            </Card.Section>
          </Card>
        </Grid.Col>
      </Grid>

      <Card shadow="sm" mt="md" radius="md" withBorder p={0}>
        <Tabs defaultValue="PodVolumes" h={290}>
          <Tabs.List>
            <Tabs.Tab value="PodVolumes" leftSection={<IconDatabaseExport size={12} />}>
              Pod volumes
            </Tabs.Tab>
            <Tabs.Tab value="Logs" leftSection={<IconFileText size={12} />}>
              Logs
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="PodVolumes">
            <PodVolumeList podVolumeName={params.backup} type="podvolumebackups" />
          </Tabs.Panel>

          <Tabs.Panel value="Logs">
            <ResourceLogs resourceType="backup" resourceName={data?.metadata?.name} />
          </Tabs.Panel>
        </Tabs>
      </Card>
    </PageScrollArea>
  );
}
