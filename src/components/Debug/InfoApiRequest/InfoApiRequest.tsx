'use client';

import { useRef, useEffect } from 'react';
import { env } from 'next-runtime-env';
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

import Link from 'next/link';

import { IconCopy, IconCheck, IconExternalLink } from '@tabler/icons-react';

import InfoParamActionIcon from './InfoParamActionIcon';
import { useLoggerStatus } from '@/contexts/LoggerContext';

export default function InfoApiRequest() {
  //const value = useContext(VeleroAppContexts);

  //const loggerEnabled = process.env.NEXT_PUBLIC_LOGGER_ENABLED === 'true';
  const loggerEnabled = env('NEXT_PUBLIC_LOGGER_ENABLED')?.toLocaleLowerCase() === 'true';

  if (!loggerEnabled) {
    return <Text size="sm" fw={800}>Logger Disabled.</Text>
  }

  const loggerValues = useLoggerStatus();
  const viewport = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (viewport !== null && viewport.current !== null) {
      viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
    }
  };

  const commands = loggerValues.apiRequest.map((item: any, index: number) => (
    <Group gap={0} key={index}>
      <CopyButton value={item.url} timeout={2000}>
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
      <Box w="3.3rem">
        <Pill radius={0} fw={700}>
          {item.method}
        </Pill>
      </Box>
      <Text c="white" size="sm">
        {item.url}
      </Text>
      <Tooltip label="Params">
        <ActionIcon component={Link} variant="transparent" href={item.url} target="_blank">
          <IconExternalLink style={{ height: rem(14), width: rem(14) }} />
        </ActionIcon>
      </Tooltip>
      {item.method === 'POST' && <InfoParamActionIcon params={item.params} />}
    </Group>
  ));

  useEffect(() => {
    // if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 505 has been called`, `color: green; font-weight: bold;`)
    scrollToBottom();
  }, [loggerValues.apiRequest]);

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
