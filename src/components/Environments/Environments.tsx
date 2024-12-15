'use client';

import React, { useEffect, useState } from 'react';

import { Stack, Loader, Center, ScrollArea, SimpleGrid, Space } from '@mantine/core';

import { useViewportSize } from '@mantine/hooks';
import { AgentStats } from './items/AgentStats';



import { useAgentStatus } from '@/contexts/AgentStatusContext';
import { useAgentStats } from '@/api/Agent/useAgentStats';

import Toolbar from '../Toolbar';
import RefreshDatatable from '../Actions/ToolbarActionIcons/RefreshDatatable';

export function Environments() {
  const agentValues = useAgentStatus();
  const { height: vpHeight, width: vpWidth } = useViewportSize();
  const { data, getAgentStats, fetching } = useAgentStats();
  const [reload, setReload] = useState(1);

  const [agentStats, setAgentStats] = useState({});

  useEffect(() => {
    if (process.env.NODE_ENV === 'development')
      console.log(`%cuseEffect 1110 has been called`, `color: green; font-weight: bold;`);
    if (agentValues.isAgentAvailable) {
      getAgentStats();
    }
  }, [reload, agentValues.isAgentAvailable]);

  useEffect(() => {
    if (data?.payload !== undefined) {
      setAgentStats(data?.payload);
      /*const jsonData = require('/mockdata/data.json');
      setAgentStats({ ...data.payload, ...jsonData });
      else
      console.log("3000", { ...data.payload, ...jsonData })*/
    }
  }, [data]);

  const agents = Object.entries(agentStats).map(([key, value]) => {
    return <AgentStats name={key} data={value} />;
  });

  return (
    <>
      <ScrollArea p={0} style={{ height: '100%' }} scrollbars="y" offsetScrollbars>
        <Stack p={5} w={vpWidth < 768 ? '100vw' : 'calc(100vw - 240px)'}>
          <Stack>
            <Toolbar title="Environments">
              {fetching && (
                <Center>
                  <Loader />
                </Center>
              )}
              <RefreshDatatable setReload={setReload} reload={reload} />
            </Toolbar>
            {!data && (
              <Stack h="100%" justify="center">
                <Center>
                  <Loader color="blue" />
                </Center>
              </Stack>
            )}
            {!data?.payload && fetching && <>No agents</>}
            {agents}
          </Stack>
        </Stack>
        <Space h={20} />
      </ScrollArea>
    </>
  );
}
