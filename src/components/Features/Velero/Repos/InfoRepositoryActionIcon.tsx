'use client';

import { useEffect } from 'react';
import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconCalculator } from '@tabler/icons-react';

import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite';

import 'react-json-view-lite/dist/index.css';
import { useCheckRepository } from '@/api/S3/useCheckRepository';

interface InfoRepositoryProps {
  repositoryURL: string;
  backupStorageLocation: string;
  repositoryName: string;
  repositoryType: string;
  volumeNamespace: string;
}

export default function InfoRepositoryActionIcon({
  repositoryURL,
  backupStorageLocation,
  repositoryName,
  repositoryType,
  volumeNamespace,
}: InfoRepositoryProps) {
  const { data: dataRepository, checkRepository } = useCheckRepository();
  useEffect(() => {
    if (dataRepository !== undefined) {
      openModal({
        title: `Stats ${repositoryName}`,
        size: '80%',
        children: (
          <JsonView data={dataRepository} shouldExpandNode={allExpanded} style={defaultStyles} />
        ),
      });
    }
  }, [dataRepository]);

  return (
    <Tooltip label="Stats">
      <ActionIcon
        size="sm"
        variant="subtle"
        onClick={(e) => {
          e.stopPropagation();
          checkRepository(
            repositoryURL,
            backupStorageLocation,
            repositoryName,
            repositoryType,
            volumeNamespace
          );
        }}
      >
        <IconCalculator color="green" />
      </ActionIcon>
    </Tooltip>
  );
}
