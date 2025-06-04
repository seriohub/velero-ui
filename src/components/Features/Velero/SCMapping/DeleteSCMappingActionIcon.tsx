import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IconTrashX } from '@tabler/icons-react';

import { SCMappingDelete } from '@/components/Features/Velero/SCMapping/Forms/SCMappingDelete';

interface DeleteSCMappingActionIconProps {
  record: any;
  setReload: React.Dispatch<React.SetStateAction<number>>;
}

export default function DeleteSCMappingActionIcon({
                                                    record,
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
            children: <SCMappingDelete record={record} setReload={setReload}/>,
          });
        }}
      >
        <IconTrashX color="red"/>
      </ActionIcon>
    </Tooltip>
  );
}
