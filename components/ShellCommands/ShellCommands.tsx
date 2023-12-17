'use client';

import { useRef, useEffect } from 'react';

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
import { useAppWebSocket } from '@/hooks/useAppWebSocket';

export default function ShellCommands() {
  const { messageHistory, lastMessage, connectionStatus } = useAppWebSocket();
  const viewport = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (viewport !== null && viewport.current !== null) {
      viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
    }
  };

  const commands = messageHistory.map((item: any, index: number) => (
    <Group gap={0} key={index}>
      <CopyButton value={item.data} timeout={2000}>
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
        {item.data}
      </Text>
    </Group>
  ));

  useEffect(() => {
    scrollToBottom();
  }, [messageHistory]);

  if (lastMessage === null || !('data' in lastMessage)) {
    return <></>;
  }

  return (
    <>
      <Box p={2} h="130px">
        <ScrollArea px={10} h="100%" type="always" viewportRef={viewport} scrollbarSize={8}>
          <Code block color="#010101">
            {commands}
          </Code>
        </ScrollArea>
      </Box>
    </>
  );
}
