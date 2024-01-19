'use client';

import { Loader, Center, Box, TextInput, Group, Button } from '@mantine/core';
import { useEffect } from 'react';
import { useForm } from '@mantine/form';

import { useApiGet } from '@/hooks/useApiGet';

import 'react-json-view-lite/dist/index.css';

interface UpdateExpirationProps {
  record: any;
}

export function UpdateExpiration({ record = {} }: UpdateExpirationProps) {
  const { data, getData } = useApiGet();

  // const [credential, setCredential] = useState<any>({});

  const form = useForm({
    initialValues: {
      expiration: '',
    },
    validate: {
      expiration: (value) => (value.length === 0 ? 'Invalid expiration' : null),
    },
  });

  useEffect(() => {
    getData('/api/v1/backup/get-expiration', `backup_name=${record.metadata.name}`);
  }, []);

  useEffect(() => {
    if (data !== undefined) {
      form.setFieldValue('expiration', data.payload.expiration);
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
    getData(
      '/api/v1/backup/update-expiration',
      `backup_name=${record.metadata.name}&expiration=${values.expiration}`
    );
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
