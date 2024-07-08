'use client';

import { Loader, Center, Box, TextInput } from '@mantine/core';
import { useEffect } from 'react';
import { useForm } from '@mantine/form';

import { useApiGet } from '@/hooks/useApiGet';

import 'react-json-view-lite/dist/index.css';

interface CredentialProps {
  record: string;
  secretName?: string;
  secretKey?: string;
  cloudCredential?: boolean;
}

export function Credential({
  record = '',
  secretName = '',
  secretKey = '',
  cloudCredential = false,
}: CredentialProps) {
  const { data, getData } = useApiGet();

  // const [credential, setCredential] = useState<any>({});

  const form = useForm({
    initialValues: {
      aws_access_key_id: '',
      aws_secret_access_key: '',
    },
    validate: {
      aws_access_key_id: (value) => (value.length === 0 ? 'Invalid aws_access_key_id' : null),
      aws_secret_access_key: (value) =>
        value.length === 0 ? 'Invalid aws_secret_access_key' : null,
    },
  });

  useEffect(() => {
    if (!cloudCredential) {
      getData({url:'/v1/k8s/credential/get', param:`secret_name=${secretName}&secret_key=${secretKey}`});
    } else {
      getData({url:'/v1/k8s/credential/default/get'});
    }
  }, []);

  useEffect(() => {
    if (data !== undefined) {
      form.setFieldValue('aws_access_key_id', data.payload?.aws_access_key_id);
      form.setFieldValue('aws_secret_access_key', data.payload?.aws_secret_access_key);
    }
  }, [data]);

  if (record === undefined) {
    return (
      <Center>
        <Loader color="blue" />
      </Center>
    );
  }

  return (
    <>
      <Box mx="auto">
        <form
          onSubmit={form.onSubmit((values: any) => {
            // onDone(values);
          })}
        >
          <TextInput
            label="aws_access_key_id"
            placeholder=""
            {...form.getInputProps('aws_access_key_id')}
          />
          <TextInput
            label="aws_secret_access_key"
            placeholder=""
            {...form.getInputProps('aws_secret_access_key')}
          />
        </form>
      </Box>
    </>
  );
}
