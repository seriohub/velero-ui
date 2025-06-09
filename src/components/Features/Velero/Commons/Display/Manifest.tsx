'use client';

import {
  ActionIcon,
  Box,
  Center,
  CloseButton,
  Code,
  CopyButton,
  Flex,
  Group,
  Loader,
  ScrollArea,
  Switch,
  Text,
  TextInput,
  Tooltip,
  useComputedColorScheme,
} from '@mantine/core';

import { IconCheck, IconCopy, IconSearch } from '@tabler/icons-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';
import { useVeleroManifest } from '@/api/Velero/useVeleroManifest';
import { useAgentStatus } from '@/contexts/AgentContext';
import { isRecordStringAny } from '@/utils/isRecordStringIsType';
import { convertJsonToYaml } from '@/utils/jsonToYaml';
import { eventEmitter } from '@/lib/EventEmitter.js';

interface ManifestProps {
  resourceType: string;
  resourceName: string;
  reload?: number;
}

export function Manifest({
                           resourceType,
                           resourceName,
                           reload
                         }: ManifestProps) {
  const computedColorScheme = useComputedColorScheme();
  const {
    fetching,
    data,
    getManifest
  } = useVeleroManifest();
  const agentValues = useAgentStatus();
  const [neat, setNeat] = useState(false);
  const [manifest, setManifest] = useState<Record<string, any>>([]);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce logic
  const debouncedSetSearch = useCallback(
    debounce((value: string) => setDebouncedSearch(value), 200),
    []
  );
  useEffect(() => {
    debouncedSetSearch(search);
    return () => debouncedSetSearch.cancel();
  }, [search, debouncedSetSearch]);

  /* watch */
  const handleWatchResources = debounce((message) => {
    if (
      message?.payload?.resource?.kind === resourceType &&
      message?.payload?.resource?.metadata?.name === resourceName
    ) {
      getManifest(resourceType, resourceName, neat);
    }
  }, 150);

  useEffect(() => {
    eventEmitter.on('watchResources', handleWatchResources);

    return () => {
      eventEmitter.off('watchResources', handleWatchResources);
    };
  }, []);
  /* end watch */

  useEffect(() => {
    getManifest(resourceType, resourceName, neat);
  }, [agentValues.isAgentAvailable, neat, reload]);

  useEffect(() => {
    if (isRecordStringAny(data)) {
      setManifest(data);
    } else {
      setManifest([]);
    }
  }, [data]);

  // Convert to YAML string
  const yamlString = useMemo(() => convertJsonToYaml(manifest), [manifest]);

  // Compute highlighted YAML with <mark> tags
  const highlightedYaml = useMemo(() => {
    if (!debouncedSearch) return yamlString;
    const regex = new RegExp(`(${debouncedSearch})`, 'gi');
    return yamlString.replace(regex, '<mark>$1</mark>');
  }, [yamlString, debouncedSearch]);

  // Compute match line indices for minimap
  const matchLines = useMemo(() => {
    if (!debouncedSearch) return [];
    const lines = yamlString.split('\n');
    return lines.reduce((acc: number[], line, index) => {
      if (line.toLowerCase().includes(debouncedSearch.toLowerCase())) {
        acc.push(index);
      }
      return acc;
    }, []);
  }, [yamlString, debouncedSearch]);

  return (
    <Flex direction="column" gap={10} h="calc(100% - 10px)">
      <Group justify="space-between">
        <Group gap={5}>
          <CopyButton value={convertJsonToYaml(manifest)} timeout={2000}>
            {({
                copied,
                copy
              }) => (
              <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                <ActionIcon color={copied ? 'teal' : 'gray'} variant="transparent" onClick={copy}>
                  {copied ? <IconCheck size={16}/> : <IconCopy size={16}/>}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
          <Text fw={600}>Manifest</Text>
        </Group>
        <TextInput
          w={250}
          ml={30}
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          leftSection={<IconSearch/>}
          rightSection={
            <CloseButton
              aria-label="Clear input"
              onClick={() => setSearch('')}
              style={{ display: search ? undefined : 'none' }}
            />
          }
        />
        <Switch
          checked={neat}
          onChange={(event) => setNeat(event.currentTarget.checked)}
          label="Neat"
          labelPosition="left"
        />
      </Group>

      <ScrollArea type="auto">
        {/* Minimap indicator bar */}
        <Box
          pos="absolute"
          top={0}
          right={1}
          w={15}
          h="100%"
          style={{
            pointerEvents: 'none',
            zIndex: 2
          }}
        >
          {matchLines.map((lineIndex, i) => (
            <Box
              key={i}
              pos="absolute"
              top={`${(lineIndex / yamlString.split('\n').length) * 100}%`}
              h={2}
              w="100%"
              bg="yellow"
              style={{
                borderRadius: 2,
                opacity: 0.5
              }}
            />
          ))}
        </Box>

        {fetching && manifest.length === 0 && (
          <Center>
            <Loader/>
          </Center>
        )}
        {manifest.length !== 0 && (
          <Code block style={{ borderRadius: '5px' }} color={computedColorScheme === 'light' ? '' : 'dark.8'}>
          <pre>
              <Text size="xs" component="div" style={{ fontFamily: 'monospace' }}
                    dangerouslySetInnerHTML={{ __html: highlightedYaml }}/>
            </pre>
          </Code>
        )}
      </ScrollArea>


    </Flex>
  );
}
