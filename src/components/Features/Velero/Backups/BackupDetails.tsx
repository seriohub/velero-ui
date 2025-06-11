'use client';

import { useEffect, useState } from 'react';
import { Box, Tabs } from '@mantine/core';
import { debounce } from 'lodash';
import { IconDatabaseExport, IconFileText } from '@tabler/icons-react';

import { useVeleroManifest } from '@/api/Velero/useVeleroManifest';
import { eventEmitter } from '@/lib/EventEmitter.js';

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
import { VeleroDetailsLayout } from '@/components/Commons/VeleroDetailsLayout';

interface BackupProps {
  params: any;
}

export function BackupDetails({ params }: BackupProps) {
  const {
    data,
    getManifest
  } = useVeleroManifest();

  const [reload, setReload] = useState(1);

  const [manifest, setManifest] = useState<Record<string, any>>([]);

  /* watch */
  // useWatchResources('backups');
  const handleWatchResources = debounce((message) => {
    if (message?.payload?.resources === 'backups' && message?.payload?.resource?.metadata?.name === params.backup) {
      setManifest(message?.payload?.resource);
    }
  }, 150);

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
  }, [reload]);

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
          title="Backup"
          breadcrumbItem={[
            {
              name: 'Backups',
              href: '/backups/'
            },
            { name: `${params.backup}` },
          ]}
        >
          <ReloadData setReload={setReload} reload={reload}/>
          <RestoreAction record={manifest} setReload={setReload} buttonType="button"/>
          <InspectAction record={manifest} buttonType="button"/>
          <DownloadAction record={manifest} buttonType="button"/>
          <UpdateExpirationAction record={manifest} setReload={setReload} buttonType="button"/>
          <DeleteAction
            resourceType="backup"
            record={manifest}
            setReload={setReload}
            buttonType="button"
            redirectAfterDelete="/backups"
          />
        </Toolbar>
      }
      details={<BackupDetailsView data={manifest}/>}
      manifest={<Manifest resourceType="Backup" resourceName={params.backup} reload={reload}/>}
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

          <Tabs.Panel value="PodVolumes" h="100%">
            <Box p={0} h="100%">
              <PodVolumeList podVolumeName={params.backup} type="podvolumebackups"/>
            </Box>
          </Tabs.Panel>

          <Tabs.Panel value="Logs" h="100%">
            <Box p={5} h="100%">
              <ResourceLogs resourceType="backup" resourceName={data?.metadata?.name} h={height - 50}/>
            </Box>
          </Tabs.Panel>
        </Tabs>
      )}
    />
  );
}
