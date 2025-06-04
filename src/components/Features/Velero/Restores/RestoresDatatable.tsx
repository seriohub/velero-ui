'use client';

import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

import { useRestores } from '@/api/Restore/useRestores';
import { eventEmitter } from '@/lib/EventEmitter.js';

import { MainStack } from '@/components/Commons/MainStack';
import Toolbar from '@/components/Display/Toolbar';
import { DataFetchedInfo } from '@/components/Display/DataFetchedInfo';
import { RestoresMRT } from '@/components/Features/Velero/Restores/RestoresMRT';

export function RestoresDatatable() {

  const {
    data,
    getRestores,
    fetching,
    fetchedTime
  } = useRestores();

  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [reload, setReload] = useState(1);

  // useWatchResources('restores');
  /* watch */
  const handleWatchResources = debounce((message) => {
    if (message?.payload?.resources === 'restores') {
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
    if (reload > 1) getRestores(true);
  }, [reload]);

  useEffect(() => {
    getRestores(true);
  }, []);

  useEffect(() => {
    if (data !== undefined && Array.isArray(data)) {
      setItems(data.filter((item) => typeof item === 'object' && item !== null));
    } else {
      setItems([]);
    }
  }, [data]);

  return (
    <MainStack>
      <Toolbar title="Restore" breadcrumbItem={[{ name: 'Restores' }]}>
        <></>
      </Toolbar>
      <RestoresMRT
        fetching={fetching}
        setReload={setReload}
        items={items}
      />
      <DataFetchedInfo fetchedTime={fetchedTime}/>
    </MainStack>
  );
}
