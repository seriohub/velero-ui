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
              <Group gap={3} {...elementProps}>
                {hasChildren && (
                  <IconChevronDown
                    size={18}
                    style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                )}
                {hasChildren && (
                  <Group gap={4}>
                    <IconFolder size="16" />
                    <Text
                      size="sm"
                      /*style={{
                        wordBreak: 'break-all',
                        maxWidth: '330px',
                      }}*/
                    >
                      {node.label}
                    </Text>
                  </Group>
                )}
                {!hasChildren && (
                  <Group gap={4} w={800}>
                    <IconFileText size="16" />
                    <Text
                      size="sm"
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
