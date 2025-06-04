'use client';

import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

import { useWatchResources } from '@/hooks/useWatchResources';
import { eventEmitter } from '@/lib/EventEmitter.js';
import { useBackupLocation } from '@/api/BackupLocation/useBackupLocation';

import { MainStack } from '@/components/Commons/MainStack';
import CreateBslToolbar from '@/components/Features/Velero/BackupLocations/Actions/CreateBslToolbar';
import { BslMRT } from '@/components/Features/Velero/BackupLocations/BslMRT';
import Toolbar from '@/components/Display/Toolbar';
import { DataFetchedInfo } from '@/components/Display/DataFetchedInfo';

export function BslDatatable() {

  const {
    data,
    getBackupLocation,
    fetching,
    fetchedTime
  } = useBackupLocation();
  const [items, setItems] = useState<Array<any>>([]);
  const [reload, setReload] = useState(1);

  /* watch */
  useWatchResources('backupstoragelocations');
  const handleWatchResources = debounce((message) => {
    if (message?.payload?.resources === 'backupstoragelocations') {
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
    getBackupLocation(true);
  }, [reload]);

  useEffect(() => {
    getBackupLocation();
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
        title="Backup Storage Locations"
        breadcrumbItem={[
          {
            name: 'Backups Storage Locations',
          },
        ]}
      >
        <></>
      </Toolbar>
      <BslMRT
        fetching={fetching}
        setReload={setReload}
        items={items}
        customActions={
          <>
            <CreateBslToolbar setReload={setReload} reload={reload}/>
          </>
        }
      />
      <DataFetchedInfo fetchedTime={fetchedTime}/>
    </MainStack>
  );
}
