'use client';

import { Loader, Center, Box, TextInput, Group, Button } from '@mantine/core';
import { useEffect } from 'react';
import { useForm } from '@mantine/form';

import 'react-json-view-lite/dist/index.css';
import { useBackupExpiration } from '@/api/Backup/useBackupExpiration';
import { useBackupUpdateExpiration } from '@/api/Backup/useBackupUpdateExpiration';

interface UpdateExpirationProps {
  record: any;
}

export function UpdateExpiration({ record = {} }: UpdateExpirationProps) {
  const { data, getBackupExpiration } = useBackupExpiration();
  const { backupUpdateExpiration } = useBackupUpdateExpiration(); // Todo: change method

  const form = useForm({
    initialValues: {
      expiration: '',
    },
    validate: {
      expiration: (value) => (value.length === 0 ? 'Invalid expiration' : null),
    },
  });

  useEffect(() => {
    getBackupExpiration(record.metadata.name);
  }, []);

  useEffect(() => {
    if (data !== undefined) {
      form.setFieldValue('expiration', data.toString());
    }
  }, [data]);

  if (record === undefined) {
    return (
      <Center>
        <Loader color="blue" />
      </Center>
    );
  }

  function onDone(values: any) {
    /*getData2({
      url: '/v1/[backup]/update-expiration',
      param: `backup_name=${record.metadata.name}&expiration=${values.expiration}`,
    });*/
    backupUpdateExpiration(record.metadata.name, values.expiration);
  }

  return (
    <>
      <Box mx="auto">
        <form
          onSubmit={form.onSubmit((values: any) => {
            onDone(values);
          })}
        >
          <TextInput label="expiration" placeholder="" {...form.getInputProps('expiration')} />
          <Group justify="flex-end" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Box>
    </>
  );
}
