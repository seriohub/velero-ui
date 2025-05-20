import { useEffect } from 'react';

import { useForm } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';

import { Box, Button, Group, Input, Select, TextInput } from '@mantine/core';
import { useAppStatus } from '@/contexts/AppContext';
import { useStorageClasses } from '@/api/Kubernetes/useStorageClasses';
import { useSCCreateMap } from '@/api/SCMapping/useSCCreateMap';
import { useSCUpdateMap } from '@/api/SCMapping/useSCUpdateMap';

interface SCMappingFormProps {
  record?: any;
  reload: number;
  setReload: React.Dispatch<React.SetStateAction<number>>;
  mode: string;
}

export function SCMappingForm({
                                record = null,
                                reload,
                                setReload,
                                mode = 'create',
                              }: SCMappingFormProps) {
  const appValues = useAppStatus();

  const {
    data: storageClasses,
    getStorageClasses
  } = useStorageClasses();
  const { handleScCreateMap } = useSCCreateMap();
  const { handleScUpdateMap } = useSCUpdateMap();
  const form = useForm({
    initialValues: {
      oldStorageClass: mode === 'create' ? '' : record.oldStorageClass,
      newStorageClass: mode === 'create' ? '' : record.newStorageClass,
    },

    validate: {
      oldStorageClass: (value) => (value.length === 0 ? 'Invalid name' : null),
      newStorageClass: (value) => (value.length === 0 ? 'Invalid name' : null),
    },
  });

  useEffect(() => {
    getStorageClasses();
  }, []);

  function onDone(values: any) {
    if (mode === 'create') {
      handleScCreateMap(values);
    } else {
      handleScUpdateMap(values);
    }

    closeAllModals();
    const interval = setInterval(() => {
      setReload(reload + 1);
      clearInterval(interval);
    }, appValues.refreshDatatableAfter);
  }

  return (
    <>
      <Box mx="auto">
        <form
          onSubmit={form.onSubmit((values: any) => {
            onDone(values);
          })}
        >
          <Input.Wrapper label="Storage Class" description="Storage class used in backup">
            <TextInput
              placeholder=""
              {...form.getInputProps('oldStorageClass')}
              disabled={mode === 'update'}
            />
          </Input.Wrapper>

          <Input.Wrapper
            label="Storage Classes included in the backup"
            mt={10}
            description="New Storage Class to be used for restore"
          >
            <Select
              placeholder="Pick value"
              {...form.getInputProps('newStorageClass')}
              data={storageClasses !== undefined ? Object.keys(storageClasses) : []}
            />
          </Input.Wrapper>
          <Group justify="flex-end" mt="20">
            <Button type="submit">{mode === 'create' ? 'Create' : 'Update'}</Button>
          </Group>
        </form>
      </Box>
    </>
  );
}
