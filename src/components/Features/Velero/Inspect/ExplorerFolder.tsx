'use client';

import { Group, Tree, Text } from '@mantine/core';

import { IconChevronDown } from '@tabler/icons-react';

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
      {Object.keys(content).length > 0 && (
        <Tree
          data={content}
          renderNode={({ node, expanded, hasChildren, elementProps }) => (
            <Group gap={3} {...elementProps}>
              {hasChildren && (
                <IconChevronDown
                  size={18}
                  style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              )}
              {hasChildren && <Text size="sm">{node.label}</Text>}
              {!hasChildren && (
                <Text
                  size="sm"
                  fw={800}
                  c="var(--mantine-primary-color-filled)"
                  onClick={() => {
                    setCurrentFile(`${backupName}/${node.value}`);
                    getInspectFile(`${backupName}/${node.value}`);
                  }}
                >
                  {node.label}
                </Text>
              )}
            </Group>
          )}
        />
      )}
    </>
  );
}
