'use client';

import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

import { useStatsInProgress } from '@/api/Stats/useStatsInProgress';
import { eventEmitter } from '@/lib/EventEmitter.js';

import { BackupRestoreStreamMRT } from '@/components/Features/Velero/EventStream/BackupsRestoresMRT';

export default function BackupRestoreStream({
                                              reload,
                                              setReload,
                                              active,
                                              setFetchingData,
                                              enableTopToolbar,
                                            }: any) {

  const {
    data,
    getStatsInProgress,
    fetching
  } = useStatsInProgress();

  const [records, setRecords] = useState<Array<any>>([]);

  /* watch */
  // useWatchResources(type ? 'podvolumebackups' : 'podvolumerestores');
  const handleWatchResources = debounce((message) => {
    if (message?.payload?.resources === 'backups' || message?.payload?.resources === 'restores') {
      setReload((prev: number) => prev + 1);
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
    if (active) return undefined;
    getStatsInProgress();
    return undefined;
  }, []);

  useEffect(() => {
    if (!active) return undefined;
    getStatsInProgress();
    return undefined;
  }, [active]);

  useEffect(() => {
    if (active) getStatsInProgress();
  }, [reload]);

  useEffect(() => {
    setFetchingData(fetching);
  }, [fetching]);

  useEffect(() => {
    if (data !== undefined && Array.isArray(data)) {
      setRecords(data);
    } else {
      setRecords([]);
    }
  }, [data]);

  return (
    <BackupRestoreStreamMRT
      enableTopToolbar={enableTopToolbar}
      fetching={fetching}
      setReload={setReload}
      items={records}
    />
  );
}
