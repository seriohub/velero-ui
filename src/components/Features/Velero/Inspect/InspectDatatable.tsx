'use client';

import { useEffect, useState } from 'react';

import { MainStack } from '@/components/Commons/MainStack';
import Toolbar from '@/components/Display/Toolbar';
import { useInspectBackups } from '@/api/Inspect/useInspectBackups';
import { InspectMRT } from '@/components/Features/Velero/Inspect/InspectMRT';

export function InspectDatatable() {
  const {
    data,
    getInspectBackups,
    fetching
  } = useInspectBackups();
  const [items, setItems] = useState<any>([]);
  const [reload, setReload] = useState(1);

  useEffect(() => {
    if (data !== undefined) {
      setItems(data);
    }
  }, [data]);

  useEffect(() => {
    getInspectBackups();
  }, [reload]);

  return (
    <MainStack>
      <Toolbar title="Inspect Backups" breadcrumbItem={[{ name: 'Inspect Datatable' }]}>
        <></>
      </Toolbar>

      <InspectMRT
        fetching={fetching}
        setReload={setReload}
        items={items}
      />
    </MainStack>
  );
}
