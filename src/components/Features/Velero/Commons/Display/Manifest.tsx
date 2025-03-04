'use client';

import {
  Card,
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
} from '@mantine/core';

import { IconCopy, IconCheck } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useVeleroManifest } from '@/api/Velero/useVeleroManifest';
import { useAgentStatus } from '@/contexts/AgentContext';
import { isRecordStringAny } from '@/utils/isRecordStringIsType';
import { convertJsonToYaml } from '@/utils/jsonToYaml';

interface ManifestProps {
  resourceType: string;
  resourceName: string;
}

export function Manifest({ resourceType, resourceName }: ManifestProps) {
  const { fetching, data, getManifest } = useVeleroManifest();
  const agentValues = useAgentStatus();
  const [neat, setNeat] = useState(false);
  const [manifest, setManifest] = useState<Record<string, any>>([]);

  useEffect(() => {
    getManifest(resourceType, resourceName, neat);
  }, [agentValues.isAgentAvailable, neat]);

  useEffect(() => {
    if (isRecordStringAny(data)) {
      setManifest(data);
    } else {
      setManifest([]);
    }
  }, [data]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder h={600}>
      <Card.Section withBorder inheritPadding p="sm">
        <Group justify="space-between">
          <Group gap={5}>
            <CopyButton value={convertJsonToYaml(manifest)} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                  <ActionIcon color={copied ? 'teal' : 'gray'} variant="transparent" onClick={copy}>
                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
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
      </Card.Section>
      <Card.Section p="sm">
        <ScrollArea p={0} h={525}>
          <Code block>
            {fetching && (
              <Center>
                <Loader />
              </Center>
            )}
            {!fetching && (
              <pre>
                <Text size="sm">{convertJsonToYaml(manifest)}</Text>
              </pre>
            )}
          </Code>
        </ScrollArea>
      </Card.Section>
    </Card>
  );
}
