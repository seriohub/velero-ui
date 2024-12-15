'use client';

import { useEffect } from 'react';

import { useForm } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';

import { useAppState } from '@/contexts/AppStateContext';
import { Box, Button, Group, Select, TextInput } from '@mantine/core';
import { useStorageClasses } from '@/api/SCMapping/useStorageClasses';
import { useSCCreateMap } from '@/api/SCMapping/useSCCreateMap';
import { useSCUpdateMap } from '@/api/SCMapping/useSCUpdateMap';

interface SCMappingFormProps {
  record?: any;
  reload: number;
  setReload: any;
  mode: string;
}

export function SCMappingForm({
  record = null,
  reload,
  setReload,
  mode = 'create',
}: SCMappingFormProps) {
  const appValues = useAppState();

  const { data: storageClasses, getStorageClasses } = useStorageClasses();
  const { handleScCreateMap } = useSCCreateMap();
  const { handleScUpdateMap } = useSCUpdateMap();
  const form = useForm({
    initialValues: {
      oldStorageClass: mode == 'create' ? '' : record['oldStorageClass'],
      newStorageClass: mode == 'create' ? '' : record['newStorageClass'],
    },

    validate: {
      oldStorageClass: (value) => (value.length === 0 ? 'Invalid name' : null),
      newStorageClass: (value) => (value.length === 0 ? 'Invalid name' : null),
    },
  });

  useEffect(() => {
    if (process.env.NODE_ENV === 'development')
      console.log(`%cuseEffect 305 has been called`, `color: green; font-weight: bold;`);
    getStorageClasses();
  }, []);

  function onDone(values: any) {
    if (mode == 'create') {
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
          <TextInput
            label="Name"
            placeholder=""
            {...form.getInputProps('oldStorageClass')}
            disabled={mode == 'update'}
          />
          <Select
            label="New Storage Class"
            placeholder="Pick value"
            {...form.getInputProps('newStorageClass')}
            data={storageClasses !== undefined ? Object.keys(storageClasses.payload) : []}
          />

          <Group justify="flex-end" mt="md">
            <Button type="submit">{mode === 'create' ? 'Create' : 'Update'}</Button>
          </Group>
        </form>
      </Box>
    </>
  );
}
