import { Button, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IconPlus } from '@tabler/icons-react';

import { SCMappingForm } from '@/components/Features/Velero/SCMapping/Forms/SCMappingForm';

interface CreateSCMappingIconProps {
  reload: number;
  setReload: React.Dispatch<React.SetStateAction<number>>;
}

export default function CreateSCMappingIcon({
                                              reload,
                                              setReload
                                            }: CreateSCMappingIconProps) {
  return (
    <Tooltip label="Create Storage Class Mapping">
      <Button
        variant="default"
        className="react-table-custom-action"
        h={38}
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            title: 'Create New Storage Class Mapping',
            size: 'lg',
            children: <SCMappingForm mode="create" setReload={setReload}/>,
          });
        }}
        leftSection={<IconPlus/>}
      >
        New
      </Button>
    </Tooltip>
  );
}
