'use client';

import {
  Box,
  Center,
  CloseButton,
  Group,
  Loader,
  Paper,
  ScrollArea,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  useComputedColorScheme
} from '@mantine/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';
import { IconFilter, IconMoodSad, IconSearch } from "@tabler/icons-react";

function parseAnsiToParts(text: string, computedColorScheme: string) {
  const ANSI_COLORS: Record<string, string> = {
    '\x1b[94m': 'blue',
    '\x1b[92m': 'green',
    '\x1b[96m': computedColorScheme === 'light' ? '#1c7ed6' : 'cyan',
    '\x1b[93m': 'orange',
    '\x1b[91m': 'red',
    '\x1b[95m': 'purple',
  };

  const RESET = '\x1b[0m';
  const ansiRegex = /\x1b\[[0-9;]*m/g;
  const parts: { text: string; color?: string }[] = [];

  let currentColor: string | undefined;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = ansiRegex.exec(text)) !== null) {
    const matchStart = match.index;
    const matchEnd = ansiRegex.lastIndex;
    const ansiCode = match[0];

    if (matchStart > lastIndex) {
      parts.push({
        text: text.slice(lastIndex, matchStart),
        color: currentColor
      });
    }

    currentColor = ansiCode === RESET ? undefined : ANSI_COLORS[ansiCode] ?? currentColor;
    lastIndex = matchEnd;
  }

  if (lastIndex < text.length) {
    parts.push({
      text: text.slice(lastIndex),
      color: currentColor
    });
  }

  return parts;
}

export function LogsView({
                           items = [],
                           fetching,
                           ...rest
                         }: any) {
  const [filterMode, setFilterMode] = useState('search');

  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  const [input, setInput] = useState('');
  const [debouncedInput, setDebouncedInput] = useState('');

  const debouncedSetInput = useCallback(
    debounce((value: string) => setDebouncedInput(value), 200),
    []
  );

  useEffect(() => {
    debouncedSetInput(input);
    return () => debouncedSetInput.cancel();
  }, [input, debouncedSetInput]);

  const logsToShow = useMemo(() => {
    if (!items?.logs) return [];

    const relevantLogs = filterMode == 'filter'
      ? items.logs.filter((log: string) =>
        log.toLowerCase().includes(debouncedInput.toLowerCase())
      )
      : items.logs;

    return relevantLogs.map((log: string, index: number) => {
      const parts = parseAnsiToParts(log, computedColorScheme);
      const hasMatch = debouncedInput
        ? log.toLowerCase().includes(debouncedInput.toLowerCase())
        : false;
      return {
        parts,
        hasMatch,
        index
      };
    });
  }, [items.logs, debouncedInput, filterMode, computedColorScheme]);

  if (fetching) {
    return (
      <Center mt={50}>
        <Loader/>
      </Center>
    );
  }

  if (fetching) {
    return (
      <Center mt={50}>
        <Loader/>
      </Center>
    );
  }

  return (
    <>
      <Group mb={5} align="flex-end">
        <Center>
          <SegmentedControl data={[{
            label: 'Search mode',
            value: 'search'
          }, {
            label: 'Filter mode',
            value: 'filter'
          },]} value={filterMode} onChange={setFilterMode}/>
          <TextInput
            ml={10}
            placeholder={filterMode == 'filter' ? 'Filter rows...' : 'Search logs...'}
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            leftSection={filterMode == 'filter' ? <IconFilter/> : <IconSearch/>}
            w={400}
            rightSection={
              <CloseButton
                aria-label="Clear input"
                onClick={() => setInput('')}
                style={{ display: input ? undefined : 'none' }}
              />
            }
          />
        </Center>
      </Group>

      <Paper shadow="xs" bg={computedColorScheme === 'light' ? '#f2f3f5' : '#1f1f1f'} withBorder>
        <ScrollArea {...rest} type="auto" offsetScrollbars>
          {/* Minimap */}
          <Box
            pos="absolute"
            top={0}
            right={1}
            w={15}
            h="100%"
            style={{
              pointerEvents: 'none',
              zIndex: 2,
            }}
          >
            {logsToShow
              .filter((entry: any) => entry.hasMatch)
              .map((entry: any, i: any) => (
                <Box
                  key={i}
                  pos="absolute"
                  top={`${(entry.index / logsToShow.length) * 100}%`}
                  h={2}
                  w="100%"
                  bg="yellow"
                  style={{
                    borderRadius: 2,
                    opacity: 0.6,
                  }}
                />
              ))}
          </Box>

          <Box w="max-content">
            <Stack gap={2}>
              {logsToShow.map((logEntry: any, index: number) => (
                <Text key={index} size="sm" style={{ fontFamily: 'monospace' }}>
                  {logEntry.parts.map((part: any, i: number) => {
                    const lowerText = part.text.toLowerCase();
                    const lowerInput = debouncedInput.toLowerCase();

                    if (debouncedInput && lowerText.includes(lowerInput)) {
                      const matchIndex = lowerText.indexOf(lowerInput);
                      const before = part.text.slice(0, matchIndex);
                      const match = part.text.slice(matchIndex, matchIndex + debouncedInput.length);
                      const after = part.text.slice(matchIndex + debouncedInput.length);

                      return (
                        <span key={i} style={{ color: part.color }}>
                          {before}
                          <mark>{match}</mark>
                          {after}
                        </span>
                      );
                    } else {
                      return (
                        <span key={i} style={{ color: part.color }}>
                          {part.text}
                        </span>
                      );
                    }
                  })}
                </Text>
              ))}
              {logsToShow.length === 0 && (
                <Group gap={5}>
                  <IconMoodSad/>
                  <Text size="sm">No log found</Text>
                </Group>
              )}
            </Stack>
          </Box>
        </ScrollArea>
      </Paper>
    </>
  );
}
