'use client';

import { useRef, useEffect, useContext } from 'react';

import {
  CopyButton,
  ActionIcon,
  Tooltip,
  rem,
  Group,
  Text,
  ScrollArea,
  Code,
  Box,
  Pill,
} from '@mantine/core';

import { IconCopy, IconCheck } from '@tabler/icons-react';

import VeleroAppContexts from '@/contexts/VeleroAppContexts';

export default function InfoNotification() {
  const value = useContext(VeleroAppContexts);
  const viewport = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (viewport !== null && viewport.current !== null) {
      viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
    }
  };

  const commands = value.state.notificationHistory.map((item: any, index: number) => (
    <Group gap={5} key={index}>
      <CopyButton value={`${item.statusCode}: ${item.title}: ${item.description}`} timeout={2000}>
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
      <Pill radius={0} fw={700} bg={item.statusCode>=200 && item.statusCode<=299 ? 'green': 'red'}>
        {item.statusCode}
      </Pill>
      <Text c="white" size="sm">
        {item.title}:
      </Text>
      <Text c="white" size="sm">
        {item.description}
      </Text>
    </Group>
  ));

  useEffect(() => {
    scrollToBottom();
  }, [value.state.apiRequest]);

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
