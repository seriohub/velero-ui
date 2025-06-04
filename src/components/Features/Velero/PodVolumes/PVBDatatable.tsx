'use client';

import { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import Toolbar from '@/components/Display/Toolbar';

import { usePodVolumes } from '@/api/PodVolumeBackups/usePodVolumes';
import { useWatchResources } from '@/hooks/useWatchResources';
import { eventEmitter } from '@/lib/EventEmitter.js';

import { DataFetchedInfo } from '@/components/Display/DataFetchedInfo';
import { MainStack } from '@/components/Commons/MainStack';
import { PVBMRT } from '@/components/Features/Velero/PodVolumes/PVBMRT';

export function PVBDatatable({ type }: any) {
  const {
    data,
    getPodVolumes,
    fetching,
    fetchedTime
  } = usePodVolumes();

  const [items, setItems] = useState<Record<string, any>>([]);
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
    if (reload > 1) {
      getPodVolumes(type, true);
    }
  }, [reload]);

  useEffect(() => {
    getPodVolumes(type);
  }, []);

  useEffect(() => {
    if (data !== undefined) {
      setItems(data);
    } else {
      setItems([]);
    }
  }, [data]);

  return (
    <MainStack>
      <Toolbar
        title={type === 'PodVolumeBackup' ? 'Pod Volumes Backup' : 'Pod Volumes Restore'}
        breadcrumbItem={[
          {
            name: type === 'PodVolumeBackup' ? 'Pod Volumes Backup' : 'Pod Volumes Restore',
          },
        ]}
      >
        <></>
      </Toolbar>

      <PVBMRT
        fetching={fetching}
        setReload={setReload}
        items={items}
      />
      <DataFetchedInfo fetchedTime={fetchedTime}/>
    </MainStack>
  );
}
