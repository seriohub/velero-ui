'use client';

import React, { useEffect, useState } from 'react';

import { MainStack } from '@/components/Commons/MainStack';
import Toolbar from '@/components/Display/Toolbar';
import { useVeleroPods } from "@/api/Velero/useVeleroPods";
import { VeleroMRT } from '@/components/Features/Settings/Velero/Display/VeleroMRT';

export function Velero() {

  const {
    data,
    getVeleroPods,
    fetching
  } = useVeleroPods();

  const [reload, setReload] = useState(1);
  const [rowLogs, setRowLogs] = useState<any>([]);

  useEffect(() => {
    getVeleroPods()
  }, [reload]);

  useEffect(() => {
    if (Array.isArray(data)) {
      setRowLogs(data);
    }
  }, [data]);

  return (
    <MainStack>
      <Toolbar title="Velero" breadcrumbItem={[{ name: 'Velero' }]}>
        <></>
      </Toolbar>

      <VeleroMRT
        fetching={fetching}
        setReload={setReload}
        items={rowLogs}
      />
    </MainStack>
  );
}
