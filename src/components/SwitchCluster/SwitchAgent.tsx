import { useState } from 'react';
import { Menu, Group, rem, Button } from '@mantine/core';

import { IconChevronDown, IconRefresh, IconSpy } from '@tabler/icons-react';

import { useAgentStatus } from '@/contexts/AgentStatusContext';
import { useServerStatus } from '@/contexts/ServerStatusContext';

export function SwitchAgent() {
  const agentValues = useAgentStatus();
  const serverValues = useServerStatus();

  const [opened, setOpened] = useState(false);

  const items =
    agentValues?.agents?.map((item: any, index: number) => (
      <Menu.Item
        leftSection={<IconSpy width={18} height={18} />}
        onClick={() => {
          // console.log(appValues.agents, index);
          if (agentValues.agents != null) {
            agentValues.setCurrentAgent(agentValues.agents[index]);
            agentValues.setIsAgentAvailable(undefined)
            localStorage.setItem('agent', index.toString());
            console.log("10 Set agent available undefined")
            // router.push(`${pathname}?_=${new Date().getTime()}-${appValues.currentBackend.name}`);
            //window.location.reload();
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
          disabled={serverValues.isCurrentServerControlPlane != true}
        >
          <Menu.Target>
            <Button
              //className={serverValues.isCurrentServerControlPlane!=true?classes.controlDisabled: classes.control}
              data-expanded={opened || undefined}
              fullWidth
              justify="space-between"
              h={60}
              //px={5}
              //py={15}
              disabled={serverValues.isCurrentServerControlPlane != true}
              variant="default"
              rightSection={<IconChevronDown size="1rem" stroke={1.5} />}
              //leftSection={<IconSpy size={30} />}
            >
              {/*<Image src={selected.image} width={22} height={22} />*/}

              {/*<Box>
                  <Text fz="sm" tt="uppercase" fw={700} truncate w="100%">*/}
              {agentValues.currentAgent?.name}
              {/*</Text>
                  {/*<Text size="xs" fw={700} truncate w="100%">
                    {agentValues.currentAgent?.url}
                  </Text>
                </Box>*/}
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            {items}
            <Menu.Divider />

            {/*<Menu.Label>Config</Menu.Label>*/}
            <Menu.Item
              leftSection={<IconRefresh style={{ width: rem(14), height: rem(14) }} />}
              onClick={(event) => {
                event.preventDefault();
                agentValues.reloadAgents(agentValues.reload + 1);
              }}
            >
              Reload agents
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </>
  );
}
