'use client';

import { useEffect, useState } from 'react';

import { useDownloadBackupRequests } from '@/api/Requests/useDownloadBackupRequests';
import { debounce } from 'lodash';
import { eventEmitter } from '@/lib/EventEmitter.js';

import { DeleteBackupRequestMRT } from '@/components/Features/Velero/Requests/DeleteBackupRequestMRT';

export default function DeleteBackupRequests({
                                               reload,
                                               setReload,
                                               active,
                                               setFetchingData,
                                               enableTopToolbar
                                             }: any) {
  const {
    data,
    getDownloadBackupRequests,
    fetching
  } = useDownloadBackupRequests();

  const [records, setRecords] = useState<Array<any>>([]);

  /* watch */
  //useWatchResources(type ? 'podvolumebackups' : 'podvolumerestores');
  const handleWatchResources = debounce((message) => {
    if (message?.payload?.resources === 'deletebackuprequests') {
      setReload((prev: number) => prev + 1);
    }
  }, 250);

  useEffect(() => {
    if (!active) return undefined;
    getDownloadBackupRequests();
    return undefined;
  }, []);

  useEffect(() => {
    eventEmitter.on('watchResources', handleWatchResources);

    return () => {
      eventEmitter.off('watchResources', handleWatchResources);
    };
  }, []);
  /* end watch */

  useEffect(() => {
    getDownloadBackupRequests();
  }, [reload]);

  useEffect(() => {
    setFetchingData(fetching);
  }, [fetching]);

  useEffect(() => {
    if (data?.items !== undefined) {
      setRecords(data?.items);
    } else {
      setRecords([]);
    }
  }, [data]);

  useEffect(() => {
    if (!active) return undefined;
    getDownloadBackupRequests();
    return undefined
    /*const interval = setInterval(() => {
      getDownloadBackupRequests();
    }, appValues.refreshRecent);
    return () => clearInterval(interval);*/
  }, [active]);

  return (
    <DeleteBackupRequestMRT
      enableTopToolbar={enableTopToolbar}
      fetching={fetching}
      setReload={setReload}
      items={records}
    />
  );
}
