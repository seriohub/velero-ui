'use client';

import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';

import { useAgentStatus } from '@/contexts/AgentContext';

import { usePodVolumeDetails } from '@/api/PodVolumeBackups/usePodVolumeDetails';

import { useWatchResources } from '@/hooks/useWatchResources';
import { eventEmitter } from '@/lib/EventEmitter.js';

import { PodVolumesMRT } from '@/components/Features/Velero/PodVolumes/PodVolumesMRT';

export function PodVolumeList({
                                podVolumeName,
                                type,
                                ...rest
                              }: any) {
  const {
    data,
    fetching,
    getPodVolumeDetails
  } = usePodVolumeDetails();
  const [records, setRecords] = useState<Array<any>>([]);
  const agentValues = useAgentStatus();
  const [reload, setReload] = useState(1);

  /* watch */
  useWatchResources(type ? 'podvolumebackups' : 'podvolumerestores');
  const handleWatchResources = debounce((message) => {
    if (message?.payload?.resources === 'podvolumebackups') {
      setReload((prev) => prev + 1);
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
    if (type === 'podvolumebackups') {
      getPodVolumeDetails(podVolumeName, 'PodVolumeBackup');
    } else {
      getPodVolumeDetails(podVolumeName, 'PodVolumeRestore');
    }
  }, [agentValues.isAgentAvailable, reload]);

  useEffect(() => {
    if (data !== undefined && Array.isArray(data)) {
      setRecords(data);
    }
  }, [data]);

  return (
    <PodVolumesMRT
      fetching={fetching}
      setReload={setReload}
      items={records}
      type={type}
    />
  );
}
