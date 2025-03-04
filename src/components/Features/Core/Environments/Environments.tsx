'use client';

import React, { useEffect, useState } from 'react';

import { Stack, Loader, Center, ScrollArea, Space } from '@mantine/core';

import { useViewportSize } from '@mantine/hooks';
import { AgentStats } from './items/AgentStats';

import { useAgentStatus } from '@/contexts/AgentContext';
import { useAgentStats } from '@/api/Agent/useAgentStats';

import Toolbar from '@/components/Display/Toolbar';

import ReloadData from '@/components/Inputs/ReloadData';

export function Environments() {
  const agentValues = useAgentStatus();
  const { height: vpHeight, width: vpWidth } = useViewportSize();
  const { data, getAgentStats, fetching } = useAgentStats();
  const [reload, setReload] = useState(1);

  const [agentStats, setAgentStats] = useState({});

  useEffect(() => {
    if (agentValues.isAgentAvailable) {
      getAgentStats();
    }
  }, [reload, agentValues.isAgentAvailable]);

  useEffect(() => {
    if (data !== undefined) {
      setAgentStats(data);
    }
  }, [data]);

  const agents = Object.entries(agentStats).map(([key, value]) => (
    <AgentStats name={key} data={value} />
  ));

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
              <ReloadData setReload={setReload} reload={reload} />
            </Toolbar>
            {!data && (
              <Stack h="100%" justify="center">
                <Center>
                  <Loader color="blue" />
                </Center>
              </Stack>
            )}
            {!data && fetching && <>No agents</>}
            {agents}
          </Stack>
        </Stack>
        <Space h={20} />
      </ScrollArea>
    </>
  );
}
