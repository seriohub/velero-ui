'use client';

import { Loader, Center, Box, TextInput } from '@mantine/core';
import { useEffect } from 'react';
import { useForm } from '@mantine/form';

import 'react-json-view-lite/dist/index.css';
import { useK8sDefaultCredential } from '@/api/Kubernetes/useK8sDefaultCredential';
import { useK8sCredential } from '@/api/Kubernetes/useK8sCredential';

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
  const { data, getK8sCredential } = useK8sCredential();
  const { data: defaultData, getK8sDefaultCredential } = useK8sDefaultCredential();

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
    // if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 190 has been called`, `color: green; font-weight: bold;`);
    if (!cloudCredential) {
      getK8sCredential(secretName, secretKey);
    } else {
      getK8sDefaultCredential();
    }
  }, []);

  useEffect(() => {
    // if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 200 has been called`, `color: green; font-weight: bold;`);
    if (data !== undefined || defaultData !== undefined) {
      const c = data || defaultData;
      if (c != undefined) {
        form.setFieldValue('aws_access_key_id', c.payload?.aws_access_key_id);
        form.setFieldValue('aws_secret_access_key', c.payload?.aws_secret_access_key);
      }
    }
  }, [data, defaultData]);

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
