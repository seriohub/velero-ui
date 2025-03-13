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
import DeleteAction from '@/components/Features/Velero/Commons/Actions/DeleteAction';
import { isRecordStringAny } from '@/utils/isRecordStringIsType';
import { RestoreDetailsView } from '@/components/Features/Velero/Restores/RestoreDetailsView';
import { eventEmitter } from '@/lib/EventEmitter.js';
import { PodVolumeList } from '@/components/Features/Velero/PodVolumes/PodVolumeList';

interface RestoreProps {
  params: any;
}

export function RestoreDetails({ params }: RestoreProps) {
  const { data, getManifest } = useVeleroManifest();
  const [reload, setReload] = useState(1);
  const agentValues = useAgentStatus();
  const [manifest, setManifest] = useState<Record<string, any>>([]);

  /* watch */
  // useWatchResources('backups');
  const handleWatchResources = debounce((message) => {
    if (message?.resources === 'restores' && message?.resource?.metadata?.name === params.restore) {
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
    if (params.restore) {
      getManifest('restore', params.restore, false);
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
        <DeleteAction
          resourceType="restore"
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
          <RestoreDetailsView data={manifest} h={550} />
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
              <Manifest resourceType="Restore" resourceName={params.restore} h={530} />
            </Card.Section>
          </Card>
        </Grid.Col>
      </Grid>

      <Card shadow="sm" mt="md" radius="md" withBorder p={0}>
        <Tabs defaultValue="PodVolumes" h={420}>
          <Tabs.List>
            <Tabs.Tab value="PodVolumes" leftSection={<IconDatabaseExport size={12} />}>
              Pod volumes
            </Tabs.Tab>
            <Tabs.Tab value="Logs" leftSection={<IconFileText size={12} />}>
              Logs
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="PodVolumes">
            <PodVolumeList podVolumeName={params.backup} type="podvolumerestores" />
          </Tabs.Panel>

          <Tabs.Panel value="Logs">
            <ResourceLogs resourceType="restore" resourceName={data?.metadata?.name} />
          </Tabs.Panel>
        </Tabs>
      </Card>
    </PageScrollArea>
  );
}
