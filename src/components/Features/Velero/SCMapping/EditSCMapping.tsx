import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IconEdit } from '@tabler/icons-react';

import { SCMappingForm } from '@/components/Features/Velero/SCMapping/Forms/SCMappingForm';

interface EditSCMappingProps {
  record: any;
  setReload: React.Dispatch<React.SetStateAction<number>>;
}

export default function EditSCMapping({
                                        record,
                                        setReload
                                      }: EditSCMappingProps) {
  return (
    <Tooltip label="Edit">
      <ActionIcon
        size="sm"
        variant="subtle"
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            title: 'Edit Storage Class Mapping',
            size: 'lg',
            children: (
              <SCMappingForm record={record} setReload={setReload} mode="update"/>
            ),
          });
        }}
      >
        <IconEdit color="green"/>
      </ActionIcon>
    </Tooltip>
  );
}
