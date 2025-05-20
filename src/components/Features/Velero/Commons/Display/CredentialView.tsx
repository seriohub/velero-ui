'use client';

import { Loader, Center, Box, TextInput } from '@mantine/core';
import { useEffect } from 'react';
import { useForm } from '@mantine/form';

import 'react-json-view-lite/dist/index.css';
import { useLocationDefaultCredentials } from '@/api/Location/useLocationDefaultCredentials';
import { useLocationCredentials } from '@/api/Location/useLocationCredentials';

interface CredentialProps {
  record: string;
  secretName?: string;
  secretKey?: string;
  cloudCredential?: boolean;
}

export function CredentialView({
                                 record = '',
                                 secretName = '',
                                 secretKey = '',
                                 cloudCredential = false,
                               }: CredentialProps) {
  const {
    data,
    getK8sCredential
  } = useLocationCredentials();
  const {
    data: defaultData,
    getK8sDefaultCredential
  } = useLocationDefaultCredentials();
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
      getK8sCredential(secretName, secretKey);
    } else {
      getK8sDefaultCredential();
    }
  }, []);

  useEffect(() => {
    if (data !== undefined || defaultData !== undefined) {
      const c = data || defaultData;
      if (c !== undefined) {
        form.setFieldValue('aws_access_key_id', c?.aws_access_key_id);
        form.setFieldValue('aws_secret_access_key', c?.aws_secret_access_key);
      }
    }
  }, [data, defaultData]);

  if (record === undefined) {
    return (
      <Center>
        <Loader color="blue"/>
      </Center>
    );
  }

  return (
    <>
      <Box mx="auto">
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
      </Box>
    </>
  );
}
