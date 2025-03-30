'use client';

import {
  Center,
  Loader,
  Text,
  Stack,
  TextInput,
  Paper,
  Box,
  ScrollArea,
  useComputedColorScheme,
  Group
} from '@mantine/core';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';
import { IconMoodSad, IconSearch } from "@tabler/icons-react";

// 🔍 Parsing ANSI colors
function parseAnsiToParts(text: string, computedColorScheme: string) {
  //const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const ANSI_COLORS: Record<string, string> = {
    '\x1b[94m': 'blue',
    '\x1b[92m': 'green',
    '\x1b[96m': computedColorScheme == 'light' ? '#1c7ed6' : 'cyan',
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

// Adds the previous text to the match
    if (matchStart > lastIndex) {
      parts.push({
        text: text.slice(lastIndex, matchStart),
        color: currentColor
      });
    }

// Check the current color
    currentColor = ansiCode === RESET ? undefined : ANSI_COLORS[ansiCode] ?? currentColor;
    lastIndex = matchEnd;
  }

// Adds remaining text
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
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const [filter, setFilter] = useState('');
  const [debouncedFilter, setDebouncedFilter] = useState('');

  const debouncedSetFilter = useCallback(
    debounce((value: string) => {
      setDebouncedFilter(value);
    }, 200),
    []
  );

  useEffect(() => {
    debouncedSetFilter(filter);
    return () => {
      debouncedSetFilter.cancel();
    };
  }, [filter, debouncedSetFilter]);

  const filteredLogs = useMemo(() => {
    if (!items?.logs) return [];

    return items.logs
      .filter((log: string) => log.toLowerCase().includes(debouncedFilter.toLowerCase()))
      .map((log: string) => {
        const parts = parseAnsiToParts(log, computedColorScheme);
        return {
          parts,
          match: true
        };
      });
  }, [items.logs, debouncedFilter]);

  if (fetching) {
    return (
      <Center mt={50}>
        <Loader/>
      </Center>
    );
  }

  return (
    <>
      <TextInput
        placeholder="Filter..."
        value={filter}
        onChange={(e) => setFilter(e.currentTarget.value)}
        leftSection={<IconSearch/>}
        __clearable
        w={400}
      />
      <Paper mt={5} shadow="xs" bg={computedColorScheme === 'light' ? '#f2f3f5' : '#1f1f1f'} withBorder>
        <ScrollArea {...rest} type="auto" offsetScrollbars>
          <Box w="max-content">
            <Stack gap={2}>
              {filteredLogs.map((logEntry: any, index: number) => (
                <Text key={index} size="sm" style={{ fontFamily: 'monospace' }}>
                  {logEntry.parts.map((part: any, i: number) => {
                    const lowerText = part.text.toLowerCase();
                    const lowerFilter = debouncedFilter.toLowerCase();

                    if (debouncedFilter && lowerText.includes(lowerFilter)) {
                      const matchIndex = lowerText.indexOf(lowerFilter);
                      const before = part.text.slice(0, matchIndex);
                      const match = part.text.slice(matchIndex, matchIndex + debouncedFilter.length);
                      const after = part.text.slice(matchIndex + debouncedFilter.length);

                      return (
                        <span key={i} style={{ color: part.color }}>{before}
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
              {filteredLogs.length === 0 && (
                <Group gap={5}>
                  <IconMoodSad/>
                  <Text size="sm">No logs found</Text>
                </Group>
              )}
            </Stack>
          </Box>
        </ScrollArea>
      </Paper>
    </>
  );
}
