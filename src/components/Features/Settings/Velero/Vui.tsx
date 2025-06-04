'use client';

import React, { useEffect, useState } from 'react';

import { MainStack } from '@/components/Commons/MainStack';
import Toolbar from '@/components/Display/Toolbar';
import { useVuiPods } from "@/api/Velero/useVuiPods";
import { VuiMRT } from '@/components/Features/Settings/Velero/Display/VuiMRT';

export function Vui() {

  const {
    data,
    getVuiPods,
    fetching
  } = useVuiPods();

  const [reload, setReload] = useState(1);
  const [rowLogs, setRowLogs] = useState<any>([]);

  useEffect(() => {
    getVuiPods()
  }, [reload]);

  useEffect(() => {
    if (Array.isArray(data)) {
      setRowLogs(data);
    }
  }, [data]);

  return (
    <MainStack>
      <Toolbar title="Vui" breadcrumbItem={[{ name: 'Vui' }]}>
        <></>
      </Toolbar>

      <VuiMRT
        fetching={fetching}
        setReload={setReload}
        items={rowLogs}
      />
    </MainStack>
  );
}
