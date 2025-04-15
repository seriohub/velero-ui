import { useState } from 'react';
import { Menu, Group, rem, Button } from '@mantine/core';

import { IconRefresh, IconSpy } from '@tabler/icons-react';

import { useAgentStatus } from '@/contexts/AgentContext';
import { useServerStatus } from '@/contexts/ServerContext';

export function SwitchAgent() {
  const agentValues = useAgentStatus();
  const serverValues = useServerStatus();

  const [opened, setOpened] = useState(false);

  const items =
    agentValues?.agents?.map((item: any, index: number) => (
      <Menu.Item
        leftSection={<IconSpy width={18} height={18} />}
        onClick={() => {
          if (agentValues.agents != null) {
            agentValues.setCurrentAgent(agentValues.agents[index]);
            agentValues.setIsAgentAvailable(undefined);
            localStorage.setItem('agent', index.toString());
          }
        }}
        key={index}
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
          </Menu.Dropdown>
        </Menu>
      </Group>
    </>
  );
}
