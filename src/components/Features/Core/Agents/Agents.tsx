'use client';

import React, { useEffect, useState } from 'react';

import { Stack, Loader, Center, ScrollArea, Space, Box } from '@mantine/core';

import { useViewportSize } from '@mantine/hooks';
import { AgentStats } from './items/AgentStats';

import { useAgentStatus } from '@/contexts/AgentContext';
import { useAgentStats } from '@/api/Agent/useAgentStats';

import Toolbar from '@/components/Display/Toolbar';

import ReloadData from '@/components/Inputs/ReloadData';
import { MainStack } from "@/components/Commons/MainStack";

export function Agents() {
  const agentValues = useAgentStatus();
  const {
    height: vpHeight,
    width: vpWidth
  } = useViewportSize();
  const {
    data,
    getAgentStats,
    fetching
  } = useAgentStats();
  const [reload, setReload] = useState(1);

  const [agentStats, setAgentStats] = useState({});

  useEffect(() => {
    if (agentValues.isAgentAvailable) {
      getAgentStats();
    }
  }, [reload, agentValues.isAgentAvailable]);

  useEffect(() => {
    if (data !== undefined) {
      setAgentStats(data?.data);
    }
  }, [data]);

  const agents = Object.entries(agentStats).map(([key, value]) => (
    <Box key={key} mb={20}>
      <AgentStats name={key} data={value}/>

    </Box>
  ));

  return (
    <MainStack>
      <Toolbar title="Clusters" breadcrumbItem={[{ name: 'Clusters' }]}>
        {fetching && (
          <Center>
            <Loader/>
          </Center>
        )}
        <ReloadData setReload={setReload} reload={reload}/>
      </Toolbar>
      {!data && (
        <Stack h="100%" justify="center">
          <Center>
            <Loader color="blue"/>
          </Center>
        </Stack>
      )}
      {!data && fetching && <>No agents</>}
      {agents}
    </MainStack>
  );
}
