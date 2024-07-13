'use client';

import React, { useEffect, useState } from 'react';

import { Stack, Loader, Center, ScrollArea, SimpleGrid, Space } from '@mantine/core';

import { useViewportSize } from '@mantine/hooks';
import { useApiGet } from '@/hooks/useApiGet';
import { AgentStats } from './items/AgentStats';

import Toolbar from '../Toolbar';
import RefreshDatatable from '../Actions/ToolbarActionIcons/RefreshDatatable';
import { useAgentStatus } from '@/contexts/AgentStatusContext';

export function Environments() {
  const agentValues = useAgentStatus();
  const { height: vpHeight, width: vpWidth } = useViewportSize();
  const { data, getData, fetching } = useApiGet();
  const [reload, setReload] = useState(1);
  const [mockData, setMockData] = useState(false);

  const [agentStats, setAgentStats] = useState({});
  const [agentK8sHealth, setAgentK8sHealth] = useState({});

  useEffect(() => {
    if (process.env.NODE_ENV === 'development')
      console.log(`%cuseEffect 1110 has been called`, `color: green; font-weight: bold;`);
    if (agentValues.isAgentAvailable) {
      getData({ url: '/v1/agent/stats/get', target: 'core' });
    }
  }, [reload, agentValues.isAgentAvailable]);

  /*if (data === undefined || fetching) {
    return (
      <Stack h="100%" justify="center">
        <Center>
          <Loader color="blue" />
        </Center>
      </Stack>
    );
  }
  console.log(data);

  /*const [dataTest, setDataTest] = useState({})
  useEffect(()=>{
  
    const jsonData = require('./data.json');
    setDataTest(jsonData.payload)
    console.log(jsonData.payload)
  }, [])*/

  useEffect(() => {
    if (data !== undefined) {
      const jsonData = require('/mockdata/data.json');
      if (mockData) setAgentStats({ ...data.payload.agent_stats, ...jsonData });
      else setAgentStats(data.payload.agent_stats);
    }
  }, [data]);

  const agents = Object.entries(agentStats).map(([key, value]) => {
    return <AgentStats name={key} stats={value} />;
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
