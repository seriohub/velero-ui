'use client';

import { useRef } from 'react';
import { ScrollArea, Code, Text } from '@mantine/core';

import { env } from 'next-runtime-env';

import { DebInfoContextJson } from '../DebContextJson';

import { useLoggerStatus } from '@/contexts/LoggerContext';

type UIValues = { [key: string]: any };
interface DebUIContextProps {
  [key: string]: any;
}

export default function DebugLoggerContext(props: DebUIContextProps) {
  //const loggerEnabled = process.env.NEXT_PUBLIC_LOGGER_ENABLED === 'true';
  const loggerEnabled = env('NEXT_PUBLIC_LOGGER_ENABLED')?.toLocaleLowerCase() === 'true';

  if (!loggerEnabled) {
    return (
      <Text size="sm" fw={800}>
        Logger Disabled.
      </Text>
    );
  }

  let uiValues: UIValues;

  try {
    uiValues = useLoggerStatus();
  } catch (error: any) {
    console.error(error.message);

    return (
      <Text fw="800" size="sm">
        Not logged.
      </Text>
    );
  }

  const viewport = useRef<HTMLDivElement>(null);

  const filteredAppValues: UIValues = Object.keys(uiValues)
    //.filter(key => !key.startsWith('set'))
    .reduce((acc: UIValues, key: string) => {
      acc[key] = uiValues[key];
      return acc;
    }, {});

  return (
    <ScrollArea px={10} type="always" viewportRef={viewport} scrollbarSize={8} {...props}>
      <Code block>
        <DebInfoContextJson data={filteredAppValues} />
      </Code>
    </ScrollArea>
  );
}
