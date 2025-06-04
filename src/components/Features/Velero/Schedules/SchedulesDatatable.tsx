'use client';

import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

import { useSchedules } from '@/api/Schedule/useSchedules';
import { useWatchResources } from '@/hooks/useWatchResources';
import { eventEmitter } from '@/lib/EventEmitter.js';

import { DataFetchedInfo } from '@/components/Display/DataFetchedInfo';
import { MainStack } from '@/components/Commons/MainStack';
import Toolbar from '@/components/Display/Toolbar';
import SchedulesHeatmapToolbarIcon from '@/components/Features/Velero/Schedules/SchedulesHeatmap';
import CreateScheduleAction from '@/components/Features/Velero/Schedules/Action/CreateScheduleAction';
import { SchedulesMRT } from '@/components/Features/Velero/Schedules/SchedulesMRT';

export function SchedulesDatatable() {

  const {
    data,
    getSchedules,
    fetching,
    fetchedTime
  } = useSchedules();

  const [items = [], setItems] = useState<Array<any>>([]);
  const [reload, setReload] = useState(1);

  /* watch */
  useWatchResources('schedules');

  const handleWatchResources = debounce((message) => {
    if (message?.payload?.resources === 'schedules') {
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
    getSchedules();
  }, []);

  useEffect(() => {
    if (reload > 1) {
      getSchedules(true);
    }
  }, [reload]);

  useEffect(() => {
    if (data !== undefined && Array.isArray(data)) {
      setItems(data);
    } else {
      setItems([]);
    }
  }, [data]);

  return (
    <MainStack>
      <Toolbar title="Schedule" breadcrumbItem={[{ name: 'Schedules' }]}>
        <></>
      </Toolbar>
      <SchedulesMRT
        fetching={fetching}
        setReload={setReload}
        items={items}
        customActions={
          <>
            <CreateScheduleAction setReload={setReload} reload={reload}/>
            <SchedulesHeatmapToolbarIcon/>
          </>
        }
      />
      <DataFetchedInfo fetchedTime={fetchedTime}/>
    </MainStack>
  );
}
