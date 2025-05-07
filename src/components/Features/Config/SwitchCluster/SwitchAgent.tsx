import React, { useState } from 'react';
import { Menu, Group, rem, Button, Image } from '@mantine/core';

import { IconPlug, IconRefresh, IconSpy } from '@tabler/icons-react';

import { useAgentStatus } from '@/contexts/AgentContext';
import { useServerStatus } from '@/contexts/ServerContext';
import { useReconnectAgent } from "@/api/Nats/useReconnectAgent";

export function SwitchAgent() {
  const agentValues = useAgentStatus();
  const serverValues = useServerStatus();

  const [opened, setOpened] = useState(false);

  const {reconnectAgent} = useReconnectAgent()

  const items =
    agentValues?.agents?.map((item: any, index: number) => (
      <Menu.Item
        leftSection={<Image radius="md" h={20} w="auto" fit="contain" src="/kubernetes_logo.svg"/>}
        onClick={() => {
          if (agentValues.agents != null) {
            agentValues.setCurrentAgent(agentValues.agents[index]);
            agentValues.setIsAgentAvailable(undefined);
            localStorage.setItem('agent', index.toString());
          }
        }}
        key={index}
        disabled={agentValues.currentAgent?.name == item.name}
      >
        {item.name}
      </Menu.Item>
    )) || [];

  return (
    <>
      <Group gap={0}>
        <Menu
          onOpen={() => setOpened(true)}
          onClose={() => setOpened(false)}
          radius="md"
          width="target"
          withinPortal
          disabled={serverValues.isCurrentServerControlPlane !== true}
        >
          <Menu.Target>
            <Button
              leftSection={<Image radius="md" h={30} w="auto" fit="contain" src="/kubernetes_logo.svg"/>}
              data-expanded={opened || undefined}
              fullWidth
              //justify="space-between"
              h={50}
              disabled={serverValues.isCurrentServerControlPlane !== true}
              variant="default"
            >
              {agentValues.currentAgent?.name}
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            {items}
            <Menu.Divider />

            <Menu.Item
              leftSection={
                <IconRefresh
                  style={{
                    width: rem(14),
                    height: rem(14),
                  }}
                />
              }
              onClick={(event) => {
                event.preventDefault();
                agentValues.reloadAgents(agentValues.reload + 1);
              }}
            >
              Reload clusters
            </Menu.Item>
            <Menu.Item
              leftSection={
                <IconPlug
                  style={{
                    width: rem(14),
                    height: rem(14),
                  }}
                />
              }
              onClick={(event) => {
                event.preventDefault();
                reconnectAgent();
              }}
            >
              Try Reconnecting All Agents
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </>
  );
}
