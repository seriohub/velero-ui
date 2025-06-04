'use client';

import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

import { useWatchResources } from '@/hooks/useWatchResources';
import { eventEmitter } from '@/lib/EventEmitter.js';
import { useRepositories } from '@/api/RepositoryLocation/useRepositories';

import { MainStack } from '@/components/Commons/MainStack';
import Toolbar from '@/components/Display/Toolbar';
import { DataFetchedInfo } from '@/components/Display/DataFetchedInfo';
import { RepoMRT } from '@/components/Features/Velero/Repos/RepoMRT';

export function ReposDatatable() {

  const {
    data,
    getRepositories,
    fetching,
    fetchedTime
  } = useRepositories();

  const [items, setItems] = useState<Array<any>>([]);
  const [reload, setReload] = useState(1);

  /* watch */
  useWatchResources('backuprepositories');
  const handleWatchResources = debounce((message) => {
    if (message?.payload?.resources === 'backuprepositories') {
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
    if (reload > 1) getRepositories(true);
  }, [reload]);

  useEffect(() => {
    getRepositories();
  }, []);

  useEffect(() => {
    if (data !== undefined && Array.isArray(data)) {
      setItems(data);
    } else {
      setItems([]);
    }
  }, [data]);

  return (
    <MainStack>
      <Toolbar
        title="Repo"
        breadcrumbItem={[
          {
            name: 'Repository',
          },
        ]}
      >
        <></>
      </Toolbar>

      <RepoMRT
        fetching={fetching}
        setReload={setReload}
        items={items}
      />

      <DataFetchedInfo fetchedTime={fetchedTime}/>
    </MainStack>
  );
}
