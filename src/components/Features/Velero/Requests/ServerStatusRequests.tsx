'use client';

import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

import { useServerStatusRequests } from '@/api/Requests/useServerStatusRequests';
import { eventEmitter } from '@/lib/EventEmitter.js';
import { ServerStatusRequestMRT } from '@/components/Features/Velero/Requests/ServerStatusRequestMRT';

export default function ServerStatusRequests({
                                               reload,
                                               setReload,
                                               active,
                                               setFetchingData,
                                               enableTopToolbar
                                             }: any) {

  const {
    data,
    getServerStatusRequests,
    fetching
  } = useServerStatusRequests();

  const [records, setRecords] = useState<Array<any>>([]);

  /* watch */
  //useWatchResources(type ? 'podvolumebackups' : 'podvolumerestores');
  const handleWatchResources = debounce((message) => {
    if (message?.payload?.resources === 'serverstatusrequests') {
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
    if (active) return undefined;
    getServerStatusRequests();
    return undefined;
  }, []);

  useEffect(() => {
    getServerStatusRequests();
  }, [reload]);

  useEffect(() => {
    setFetchingData(fetching);
  }, [fetching]);

  useEffect(() => {
    if (data !== undefined) {
      setRecords(data?.items)
    } else {
      setRecords([]);
    }
  }, [data]);

  useEffect(() => {
    if (!active) return undefined;
    getServerStatusRequests();
    return undefined;
  }, [active]);

  return (
    <ServerStatusRequestMRT
      enableTopToolbar={enableTopToolbar}
      fetching={fetching}
      setReload={setReload}
      items={records}
    />
  );
}
