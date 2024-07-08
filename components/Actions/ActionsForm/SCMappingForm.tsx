'use client';

import { useContext, useEffect, useState } from 'react';

import { useForm } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';

import { useApiGet } from '@/hooks/useApiGet';
import { useApiPost } from '@/hooks/useApiPost';
import { useAppState } from '@/contexts/AppStateContext';
import { Box, Button, Group, Select, TextInput } from '@mantine/core';
import { useApiPatch } from '@/hooks/useApiPatch';

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

  const { data: storageClasses, getData: getStorageClasses } = useApiGet();
  const { postData } = useApiPost();
  const { patchData } = useApiPatch();
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
    getStorageClasses({url:'/v1/k8s/sc/get'});
  }, []);

  function onDone(values: any) {

    if (mode == 'create') {
      postData('/v1/sc/change-storage-classes-config-map/create', {
        storageClassMapping: values,
      });
    } else {
      patchData('/v1/sc/change-storage-classes-config-map/update', {
        storageClassMapping: values,
      });
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
