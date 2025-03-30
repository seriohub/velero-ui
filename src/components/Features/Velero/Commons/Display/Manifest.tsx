'use client';

import {
  Code,
  Group,
  ScrollArea,
  Text,
  ActionIcon,
  CopyButton,
  Tooltip,
  Switch,
  Loader,
  Center,
  Flex,
} from '@mantine/core';

import { IconCopy, IconCheck } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
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
  // [key: string]: any;
}

export function Manifest({
                           resourceType,
                           resourceName,
                           reload
                         }: ManifestProps) {
  const {
    fetching,
    data,
    getManifest
  } = useVeleroManifest();
  const agentValues = useAgentStatus();
  const [neat, setNeat] = useState(false);
  const [manifest, setManifest] = useState<Record<string, any>>([]);

  /* watch */
  const handleWatchResources = debounce((message) => {
    if (
      message?.resource?.kind === resourceType &&
      message?.resource?.metadata?.name === resourceName
    ) {
      // setManifest(message?.resource);
      getManifest(resourceType, resourceName, neat);
    }
  }, 250);

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
        <Switch
          checked={neat}
          onChange={(event) => setNeat(event.currentTarget.checked)}
          label="Neat"
          labelPosition="left"
        />
      </Group>

      <Code block style={{ borderRadius: '5px' }}>
        <ScrollArea>
          {fetching && manifest.length === 0 && (
            <Center>
              <Loader/>
            </Center>
          )}
          {manifest.length !== 0 && (
            <pre>
              <Text size="xs">{convertJsonToYaml(manifest)}</Text>
            </pre>
          )}
        </ScrollArea>
      </Code>
    </Flex>
  );
}
