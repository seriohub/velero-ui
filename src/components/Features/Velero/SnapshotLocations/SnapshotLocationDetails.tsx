'use client';

import { useEffect, useState } from 'react';

import { debounce } from 'lodash';
import { useAgentStatus } from '@/contexts/AgentContext';

import { useVeleroManifest } from '@/api/Velero/useVeleroManifest';

import Toolbar from '@/components/Display/Toolbar';
import ReloadData from '@/components/Inputs/ReloadData';

import {
  SnapshotLocationDetailsView
} from '@/components/Features/Velero/SnapshotLocations/SnapshotLocationDetailsView';
import { Manifest } from '@/components/Features/Velero/Commons/Display/Manifest';
import DeleteAction from '@/components/Features/Velero/Commons/Actions/DeleteAction';
import { isRecordStringAny } from '@/utils/isRecordStringIsType';
import EditVslAction from '@/components/Features/Velero/SnapshotLocations/Actions/EditVSLAction';
import { useWatchResources } from '@/hooks/useWatchResources';
import { eventEmitter } from '@/lib/EventEmitter.js';
import { VeleroDetailsLayout } from "@/components/Commons/VeleroDetailsLayout";

interface BackupProps {
  params: any;
}

export function SnapshotLocationDetails({ params }: BackupProps) {
  const {
    data,
    getManifest
  } = useVeleroManifest();
  const [reload, setReload] = useState(1);
  const agentValues = useAgentStatus();

  const [manifest, setManifest] = useState<Record<string, any>>([]);

  /* watch */
  useWatchResources('volumesnapshotlocations');
  const handleWatchResources = debounce((message) => {
    if (
      message?.payload?.resources === 'volumesnapshotlocations' &&
      message?.payload?.resource?.metadata?.name === params.vsl
    ) {
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
    <VeleroDetailsLayout
      toolbar={
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
          <ReloadData setReload={setReload} reload={reload}/>
          <EditVslAction record={manifest} setReload={setReload} buttonType="button"/>
          <DeleteAction
            resourceType="vsl"
            record={manifest}
            setReload={setReload}
            redirectAfterDelete="/volume-snapshot-locations"
            buttonType="button"
          />
        </Toolbar>
      }
      details={<SnapshotLocationDetailsView data={manifest}/>}
      manifest={<Manifest
        resourceType="VolumeSnapshotLocation"
        resourceName={params.vsl}
        reload={reload}
      />}
    />
  );
}
