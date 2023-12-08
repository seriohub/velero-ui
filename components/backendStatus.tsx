import { useContext } from "react";
{/*import { Text, Tooltip, Group, Box, Popover, Button } from "@mantine/core";
import { useState, useEffect } from "react";
import { IconPlugConnected, IconPlugConnectedX } from "@tabler/icons-react";
import { useBackendStatus } from "@/hooks/useBackendStatus";
import PipingWatsonAppContexts from "@/contexts/PipingWatsonAppContexts";
import { useDisclosure } from "@mantine/hooks";*/}
//import { useWatsonWebSocket } from "@/hooks/useWatsonWebSocket";

export const BackendStatus = () => {
  //const value = useContext(PipingWatsonAppContexts);
  //const [opened, { close, open }] = useDisclosure(false);

  //const { lastMessage,connectionStatus } = useWatsonWebSocket();

  return (
    <>
      {/*<Group position="right" spacing="xs">
        <Group sx={{ justifyContent: "flex-end" }}>
          <Group spacing={0}>
            {value.state.engineRunning ? (
              <IconPlugConnected color="green" size={22} />
            ) : (
              <IconPlugConnectedX color="red" size={22} />
            )}
            <Text size="sm">Engine Running</Text>
          </Group>

          <Group spacing={0}>
            {value.state.apiRunning ? (
              <IconPlugConnected color="green" size={22} />
            ) : (
              <IconPlugConnectedX color="red" size={22} />
            )}
            <Text size="sm">Api Running</Text>
          </Group>

          <Group spacing={0}>
            {value.state.creoRunning ? (
              <IconPlugConnected color="green" size={22} />
            ) : (
              <Popover
                width={200}
                position="bottom"
                withArrow
                shadow="md"
                opened={opened}
              >
                <Popover.Target>
                  <Button
                    onMouseEnter={open}
                    onMouseLeave={close}
                    variant="subtle"
                    color="red"
                    compact
                    sx={{ "&:hover": { pointer: "None", outline: "None" } }}
                  >
                    <IconPlugConnectedX color="red" size={22} />
                  </Button>
                </Popover.Target>
                <Popover.Dropdown sx={{ pointerEvents: "none" }}>
                  <Text size="sm">
                    Need one and only one instance of Creo running
                  </Text>
                </Popover.Dropdown>
              </Popover>
            )}
            <Text size="sm">Creo Running</Text>
          </Group>
          <Group>
            {(!value.state.creoRunning ||
              !value.state.engineRunning ||
              !value.state.apiRunning) && (
              <Text fw={700}>Houston we have a problem!</Text>
            )}
          </Group>
        </Group>
        </Group>*/}
    </>
  );
};
