'use client';

import { useRef, useEffect, useContext } from 'react';

import {
  Text,
  ScrollArea,
  Code,
  Box,
  CopyButton,
  ActionIcon,
  Tooltip,
  rem,
  Group,
} from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons-react';
/// import { useAppWebSocket } from '@/hooks/useAppWebSocket';
import { useAppStatus } from '@/contexts/AppContext';
import { useUserStatus } from '@/contexts/UserContext';
import { useSocketStatus } from '@/contexts/SocketContext';

export default function ShellCommands() {
  const socketValues = useSocketStatus();
  const userValus = useUserStatus();
  const viewport = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (viewport !== null && viewport.current !== null) {
      viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
    }
  };

  const commands = socketValues.socketHistory.map((item: any, index: number) => (
    <Group gap={0} key={index}>
      <CopyButton value={item} timeout={2000}>
        {({ copied, copy }) => (
          <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
            <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
              {copied ? (
                <IconCheck style={{ height: rem(14), width: rem(14) }} />
              ) : (
                <IconCopy style={{ height: rem(14), width: rem(14) }} />
              )}
            </ActionIcon>
          </Tooltip>
        )}
      </CopyButton>
      <Text c="white" size="sm">
        {item}
      </Text>
    </Group>
  ));

  useEffect(() => {
    // if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 875 has been called`, `color: green; font-weight: bold;`)
    scrollToBottom();
  }, [socketValues.socketHistory]);

  /*if (lastMessage === null || lastMessage === undefined || !('data' in lastMessage)) {
    return <></>;
  }*/

  return (
    <>
      <Box p={2} h="175px">
        <ScrollArea px={10} h="100%" type="always" viewportRef={viewport} scrollbarSize={8}>
          <Code block color="#010101">
            {commands}
          </Code>
        </ScrollArea>
      </Box>
    </>
  );
}
