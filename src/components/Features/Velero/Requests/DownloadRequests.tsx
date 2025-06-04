'use client';

import { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { useDownloadRequests } from '@/api/Requests/useDownloadRequests';
import { eventEmitter } from '@/lib/EventEmitter.js';

import { DownloadRequestMRT } from '@/components/Features/Velero/Requests/DownloadRequestMRT';

export default function DownloadRequests({
                                           reload,
                                           setReload,
                                           active,
                                           setFetchingData,
                                           enableTopToolbar
                                         }: any) {

  const {
    data,
    getDownloadRequests,
    fetching
  } = useDownloadRequests();

  const [records, setRecords] = useState<Array<any>>([]);

  /* watch */
  //useWatchResources(type ? 'podvolumebackups' : 'podvolumerestores');
  const handleWatchResources = debounce((message) => {
    if (message?.payload?.resources === 'downloadrequests') {
      setReload((prev: number) => prev + 1);
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
    if (!active) return undefined;
    getDownloadRequests();
    return undefined;
  }, []);

  useEffect(() => {
    getDownloadRequests();
  }, [reload]);

  useEffect(() => {
    setFetchingData(fetching);
  }, [fetching]);

  useEffect(() => {
    if (data !== undefined) {
      setRecords(data?.items);
    } else {
      setRecords([]);
    }
  }, [data]);

  useEffect(() => {
    if (!active) return undefined;
    getDownloadRequests();
    return undefined;
  }, [active]);

  return <DownloadRequestMRT
    enableTopToolbar={enableTopToolbar}
    fetching={fetching}
    setReload={setReload}
    items={records}
  />;
}
