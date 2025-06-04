'use client';

import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

import { useSnapshotLocation } from '@/api/SnapshotLocation/useSnapshotLocation';
import { useWatchResources } from '@/hooks/useWatchResources';
import { eventEmitter } from '@/lib/EventEmitter.js';

import { MainStack } from '@/components/Commons/MainStack';
import Toolbar from '@/components/Display/Toolbar';
import { DataFetchedInfo } from '@/components/Display/DataFetchedInfo';
import CreateVslToolbar from '@/components/Features/Velero/SnapshotLocations/Actions/CreateVslToolbar';
import { VslMRT } from '@/components/Features/Velero/SnapshotLocations/VslMRT';

export function SnapshotLocationsDatatable() {

  const {
    data,
    getSnapshotLocation,
    fetching,
    fetchedTime
  } = useSnapshotLocation();
  const [items, setItems] = useState<Array<any>>([]);
  const [reload, setReload] = useState(1);

  /* watch */
  useWatchResources('volumesnapshotlocations');
  const handleWatchResources = debounce((message) => {
    if (message?.payload?.resources === 'volumesnapshotlocations') {
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
    if (reload > 1) getSnapshotLocation(true);
  }, [reload]);

  useEffect(() => {
    getSnapshotLocation();
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
        title="Volume Snapshot Location"
        breadcrumbItem={[
          {
            name: 'Volume Snapshot locations',
          },
        ]}
      >
        <></>
      </Toolbar>
      <VslMRT
        fetching={fetching}
        setReload={setReload}
        items={items}
        customActions={
          <>
            <CreateVslToolbar setReload={setReload} reload={reload}/>
          </>
        }
      />
      <DataFetchedInfo fetchedTime={fetchedTime}/>
    </MainStack>
  );
}
