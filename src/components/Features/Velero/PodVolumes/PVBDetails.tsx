'use client';

import { useEffect, useState } from 'react';
import { Card, Grid } from '@mantine/core';
import { debounce } from 'lodash';
import { useVeleroManifest } from '@/api/Velero/useVeleroManifest';
import { useAgentStatus } from '@/contexts/AgentContext';

import { PageScrollArea } from '@/components/Commons/PageScrollArea';

import Toolbar from '@/components/Display/Toolbar';
import ReloadData from '@/components/Inputs/ReloadData';

import { Manifest } from '@/components/Features/Velero/Commons/Display/Manifest';

import { isRecordStringAny } from '@/utils/isRecordStringIsType';

import { PVBDetailsView } from '@/components/Features/Velero/PodVolumes/PVBDetailsView';
import { useWatchResources } from '@/hooks/useWatchResources';
import { eventEmitter } from '@/lib/EventEmitter.js';
import { VeleroDetailsLayout } from "@/components/Commons/VeleroDetailsLayout";
import EditVslAction from "@/components/Features/Velero/SnapshotLocations/Actions/EditVSLAction";
import DeleteAction from "@/components/Features/Velero/Commons/Actions/DeleteAction";
import {
  SnapshotLocationDetailsView
} from "@/components/Features/Velero/SnapshotLocations/SnapshotLocationDetailsView";

interface BackupProps {
  params: any;
  type: string;
}

export function PVBDetails({
                             params,
                             type
                           }: BackupProps) {
  const {
    data,
    getManifest,
    fetching
  } = useVeleroManifest();
  const [reload, setReload] = useState(1);
  const agentValues = useAgentStatus();

  const [manifest, setManifest] = useState<Record<string, any>>([]);

  useWatchResources(type ? 'podvolumebackups' : 'podvolumerestores');
  const handleWatchResources = debounce((message) => {
    if (
      message?.resources === (type ? 'podvolumebackups' : 'podvolumerestores') &&
      message?.resource?.metadata?.name === params.pv
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
    if (params.pv) {
      getManifest(type, params.pv, false);
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
          title={type === 'PodVolumeBackup' ? 'Pod Volume Backup' : 'Pod Volume Restore'}
          breadcrumbItem={[
            {
              name: type === 'PodVolumeBackup' ? 'Pod Volume Backup' : 'Pod Volume Restore',
              href: type === 'PodVolumeBackup' ? '/pod-volume-backups' : '/pod-volume-restores',
            },
            {
              name: `${params.pv}`,
            },
          ]}
        >
          <ReloadData setReload={setReload} reload={reload}/>
        </Toolbar>
      }
      details={<PVBDetailsView manifest={manifest} fetching={fetching}/>}
      manifest={<Manifest resourceType={type} resourceName={params.pv}/>}
    />
  );
}
