'use client';

import { useEffect, useState } from 'react';

import { useServerStatus } from '@/contexts/ServerContext';
import { useNatsClients } from '@/api/Nats/useNatsClients';
import { MainStack } from '@/components/Commons/MainStack';
import Toolbar from '@/components/Display/Toolbar';
import { NatsMRT } from '@/components/Features/Settings/Nats/NatsMRT';

export function Nats() {
  const {
    data,
    getNatsClients,
    fetching
  } = useNatsClients();
  const [items, setItems] = useState<Array<any>>([]);
  const [reload, setReload] = useState(1);
  const serverValues = useServerStatus();

  useEffect(() => {
    if (serverValues.isCurrentServerControlPlane) {
      getNatsClients();
    }
  }, []);

  useEffect(() => {
    if (serverValues.isCurrentServerControlPlane) {
      getNatsClients();
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
      <Toolbar title="Nats connections" breadcrumbItem={[{ name: 'Nats Connections' }]}>
        <></>
      </Toolbar>

      <NatsMRT
        fetching={fetching}
        setReload={setReload}
        items={items}
      />
    </MainStack>
  );
}
