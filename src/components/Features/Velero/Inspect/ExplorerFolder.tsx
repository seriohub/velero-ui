'use client';

import { Group, Tree, Text, ScrollArea } from '@mantine/core';

import { IconChevronDown, IconFileText, IconFolder } from '@tabler/icons-react';

interface ExploreFolderProps {
  backupName: any;
  content: any;
  getInspectFile: any;
  setCurrentFile: any;
}

export function ExplorerFolder({
  backupName,
  content,
  getInspectFile,
  setCurrentFile,
}: ExploreFolderProps) {
  return (
    <>
      <ScrollArea
        w={400}
        h="100%"
        type="always"
        offsetScrollbars
        style={{ borderRight: '1px solid var(--mantine-color-default-border)' }}
      >
        {Object.keys(content).length > 0 && (
          <Tree
            p={5}
            data={content}
            renderNode={({ node, expanded, hasChildren, elementProps }) => (
              <Group gap={2} {...elementProps}>
                {hasChildren && (
                  <Group gap={0} w={370}>
                    <IconChevronDown
                      size={18}
                      style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                    <IconFolder size="16" />
                    <Text size="sm" w={330} truncate inline>
                      {node.label}
                    </Text>
                  </Group>
                )}
                {!hasChildren && (
                  <Group gap={0} w={360}>
                    <IconFileText size="16" />
                    <Text
                      size="sm"
                      truncate
                      w={330}
                      fw={800}
                      c="var(--mantine-primary-color-filled)"
                      onClick={() => {
                        setCurrentFile(`${node.value}`);
                        getInspectFile(`${backupName}/${node.value}`);
                      }}
                    >
                      {node.label}
                    </Text>
                  </Group>
                )}
              </Group>
            )}
          />
        )}
      </ScrollArea>
    </>
  );
}
