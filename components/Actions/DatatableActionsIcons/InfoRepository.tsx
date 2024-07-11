'use client';
import { useEffect } from 'react';
import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconCalculator } from '@tabler/icons-react';

import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite';

import 'react-json-view-lite/dist/index.css';
import { useApiGet } from '@/hooks/useApiGet';

interface InfoRepositoryProps {
  repositoryURL: string;
  backupStorageLocation: string;
  repositoryName: string;
  repositoryType: string;
  volumeNamespace: string;
}
export default function InfoRepository({
  repositoryURL,
  backupStorageLocation,
  repositoryName,
  repositoryType,
  volumeNamespace,
}: InfoRepositoryProps) {
  const { data: dataRepository, getData: checkRepository } = useApiGet();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 350 has been called`, `color: green; font-weight: bold;`)
    if (dataRepository !== undefined) {
      // console.log(dataRepository);
      openModal({
        title: `Stats ${repositoryName}`,
        size: '80%',
        children: <JsonView data={dataRepository} shouldExpandNode={allExpanded} style={defaultStyles} />,
      });
    }
  }, [dataRepository]);

  return (
    <Tooltip label="Stats">
      <ActionIcon
        size="sm"
        variant="transparent"
        onClick={(e) => {
          e.stopPropagation();
          checkRepository({
            url:'/v1/repo/size/get',
            param:`repository_url=${repositoryURL}&backup_storage_location=${backupStorageLocation}&repository_name=${repositoryName}&repository_type=${repositoryType}&volume_namespace=${volumeNamespace}`
        });
        }}
      >
        <IconCalculator size={16} color='green'/>
      </ActionIcon>
    </Tooltip>
  );
}
