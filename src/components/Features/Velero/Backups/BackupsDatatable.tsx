'use client';

import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

import { eventEmitter } from '@/lib/EventEmitter.js';

import Toolbar from '@/components/Display/Toolbar';
import LastBackupsFilter from '@/components/Features/Velero/Backups/Actions/LastBackupsFilter';
import CreateBackupAction from '@/components/Features/Velero/Backups/Actions/CreateBackupAction';
import { DataFetchedInfo } from '@/components/Display/DataFetchedInfo';
import { useBackups } from '@/api/Backup/useBackups';
import { MainStack } from '@/components/Commons/MainStack';
import { BackupsMRT } from '@/components/Features/Velero/Backups/BackupsMRT';

interface BackupDataProps {
  scheduleName?: string; // The property is optional
}

export function BackupsDatatable({ scheduleName }: BackupDataProps) {
  const {
    data,
    getBackups,
    fetchedTime,
    fetching
  } = useBackups();

  const [items = [], setItems] = useState<Record<string, any>>([]);
  const [onlyLast4Schedule, setOnlyLast4Schedule] = useState(false);
  const [reload, setReload] = useState(1);

  // useWatchResources('backups');
  /* watch */
  const handleWatchResources = debounce((message) => {
    if (message?.payload?.resources === 'backups' || message?.payload?.resources === 'deletebackuprequests') {
      setReload((prev) => prev + 1);
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
    if (reload > 1) {
      getBackups({
        scheduleName,
        onlyLast4Schedule,
        forced: true,
      });
    }

  }, [reload]);

  useEffect(() => {
    getBackups({
      scheduleName,
      onlyLast4Schedule,
      forced: false,
    });
  }, [onlyLast4Schedule]);

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
        title="Backup"
        breadcrumbItem={scheduleName ? [{ 'name': scheduleName }, { 'name': 'Backups' }] : [{ name: 'Backups' }]}
      >
        <></>
      </Toolbar>
      <BackupsMRT
        customActions={
          <>
            <CreateBackupAction/>
            <LastBackupsFilter setOnlyLast4Schedule={setOnlyLast4Schedule}/>
          </>
        }
        fetching={fetching}
        setReload={setReload}
        items={items}
      />
      <DataFetchedInfo fetchedTime={fetchedTime}/>
    </MainStack>
  );
}

