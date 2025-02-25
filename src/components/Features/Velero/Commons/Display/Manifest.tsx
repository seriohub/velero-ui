'use client';

import * as yaml from 'js-yaml';
import {
  Card,
  Code,
  Group,
  ScrollArea,
  Text,
  ActionIcon,
  CopyButton,
  Tooltip,
} from '@mantine/core';

import { IconCopy, IconCheck } from '@tabler/icons-react';

const convertJsonToYaml = (jsonObject: Record<string, any>): string => {
  const yamlString = yaml.dump(jsonObject, {
    indent: 2,
    lineWidth: 80,
    noRefs: true,
  });
  return yamlString;
};

interface ManifestProps {
  manifest: string | any;
}

export function Manifest({ manifest }: ManifestProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding p="xs">
        <Group justify="space-between">
          <Text fw={500}>Manifest</Text>
          <CopyButton value={convertJsonToYaml(manifest)} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                <ActionIcon color={copied ? 'teal' : 'gray'} variant="outline" onClick={copy}>
                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>
      </Card.Section>
      <Card.Section p="sm">
        <ScrollArea p={0} h={600}>
          <Code block>
            <pre>
              <Text size="sm">{convertJsonToYaml(manifest)}</Text>
            </pre>
          </Code>
        </ScrollArea>
      </Card.Section>
    </Card>
  );
}
