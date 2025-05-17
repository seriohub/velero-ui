import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconTrashX } from '@tabler/icons-react';

import { SCMappingDelete } from './Forms/SCMappingDelete';

interface DeleteSCMappingActionIconProps {
  record: any;
  reload: number;
  setReload: React.Dispatch<React.SetStateAction<number>>;
}

export default function DeleteSCMappingActionIcon({
                                                    record,
                                                    reload,
                                                    setReload,
                                                  }: DeleteSCMappingActionIconProps) {
  return (
    <Tooltip label="Delete">
      <ActionIcon
        size="sm"
        variant="subtle"
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            title: 'Delete Storage Class Mapping',
            size: 'lg',
            children: <SCMappingDelete record={record} reload={reload} setReload={setReload}/>,
          });
        }}
      >
        <IconTrashX color="red"/>
      </ActionIcon>
    </Tooltip>
  );
}
