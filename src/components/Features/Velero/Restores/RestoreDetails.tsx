'use client';

import { useEffect, useState } from 'react';
import { Box, Tabs } from '@mantine/core';

import { debounce } from 'lodash';
import { IconDatabaseExport, IconFileText } from '@tabler/icons-react';
import { useVeleroManifest } from '@/api/Velero/useVeleroManifest';

import { useAgentStatus } from '@/contexts/AgentContext';

import Toolbar from '@/components/Display/Toolbar';
import ReloadData from '@/components/Inputs/ReloadData';

import { ResourceLogs } from '@/components/Features/Velero/Logs/ResourceLogs';

import { Manifest } from '@/components/Features/Velero/Commons/Display/Manifest';
import DeleteAction from '@/components/Features/Velero/Commons/Actions/DeleteAction';
import { isRecordStringAny } from '@/utils/isRecordStringIsType';
import { RestoreDetailsView } from '@/components/Features/Velero/Restores/RestoreDetailsView';
import { eventEmitter } from '@/lib/EventEmitter.js';
import { PodVolumeList } from '@/components/Features/Velero/PodVolumes/PodVolumeList';
import { VeleroDetailsLayout } from "@/components/Commons/VeleroDetailsLayout";

interface RestoreProps {
  params: any;
}

export function RestoreDetails({ params }: RestoreProps) {
  const {
    data,
    getManifest
  } = useVeleroManifest();
  const [reload, setReload] = useState(1);
  const agentValues = useAgentStatus();
  const [manifest, setManifest] = useState<Record<string, any>>([]);

  /* watch */
  // useWatchResources('backups');
  const handleWatchResources = debounce((message) => {
    if (message?.payload?.resources === 'restores' && message?.payload?.resource?.metadata?.name === params.restore) {
      setManifest(message?.payload?.resource);
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
    <VeleroDetailsLayout
      toolbar={
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
          <ReloadData setReload={setReload} reload={reload}/>
          <DeleteAction
            resourceType="restore"
            record={manifest}
            setReload={setReload}
            buttonType="button"
            redirectAfterDelete="/backups"
          />
        </Toolbar>
      }
      details={<RestoreDetailsView data={manifest}/>}
      manifest={<Manifest resourceType="Restore" resourceName={params.restore} reload={reload}/>}
      tabs={(height) => (
        <Tabs defaultValue="PodVolumes" h="100%">
          <Tabs.List>
            <Tabs.Tab value="PodVolumes" leftSection={<IconDatabaseExport size={12}/>}>
              Pod volumes
            </Tabs.Tab>
            <Tabs.Tab value="Logs" leftSection={<IconFileText size={12}/>}>
              Logs
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="PodVolumes">
            <Box p={5}>
              <PodVolumeList podVolumeName={params.backup} type="podvolumerestores" height={height}/>
            </Box>
          </Tabs.Panel>

          <Tabs.Panel value="Logs">
            <Box p={5}>
              <ResourceLogs resourceType="restore" resourceName={data?.metadata?.name} h={height - 50}/>
            </Box>
          </Tabs.Panel>
        </Tabs>
      )}
    />
  );
}
