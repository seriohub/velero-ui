import { useEffect, useState } from 'react';

import { openModal } from '@mantine/modals';
import { Box, Button, Group, TextInput, Divider, Select, SimpleGrid } from '@mantine/core';

import { useVeleroSecrets } from '@/api/Velero/useVeleroSecrets';
import { useVeleroSecretKey } from '@/api/Velero/useVeleroSecretKey';

import { CreateLocationCredentialsView } from '@/components/Features/Velero/Commons/Forms/CreateLocationCredentialsView';
import ConfigurationOptions from '@/components/Features/Velero/Commons/Inputs/ConfigurationOptions';

interface CreateVslFormProps {
  form: any;
  onDone: any;
  mode: string;
}

export default function CreateVslForm({ form, onDone, mode }: CreateVslFormProps) {
  const { data: secrets, getVeleroSecrets } = useVeleroSecrets();
  const { data: secretKeys, getVeleroSecretKey } = useVeleroSecretKey();

  const [sKeys, setSeks] = useState<Record<string, any>[]>([]);
  const [config, setConfig] = useState([]);
  const [reload, setReload] = useState(1);

  useEffect(() => {
    form.setFieldValue('config', config);
  }, [config]);

  useEffect(() => {
    getVeleroSecrets();
  }, [reload]);

  useEffect(() => {
    setSeks(Array.isArray(secretKeys) ? secretKeys : []);
  }, [secretKeys]);

  useEffect(() => {
    if (form.values.credentialName) {
      getVeleroSecretKey(form.values.credentialName);
    } else {
      form.setFieldValue('credentialKey', '');
      setSeks([]);
    }
  }, [form.values.credentialName]);

  return (
    <>
      <Box mx="auto">
        <form
          onSubmit={form.onSubmit((values: any) => {
            onDone(values);
          })}
        >
          <SimpleGrid cols={2} spacing="lg" verticalSpacing="xl">
            <TextInput
              label="Volume Snapshot Location name"
              placeholder=""
              {...form.getInputProps('name')}
              disabled={mode === 'edit'}
              required
            />

            <TextInput
              label="Provider"
              placeholder=""
              {...form.getInputProps('provider')}
              required
            />
          </SimpleGrid>
          <Divider my="xs" label="Credentials" labelPosition="left" mt={30} />
          <SimpleGrid cols={2} spacing="lg" verticalSpacing="lg">
            <Select
              clearable
              label="Credential secret name"
              data={secrets}
              {...form.getInputProps('credentialName')}
            />

            <Select label="Credential key" data={sKeys} {...form.getInputProps('credentialKey')} />
          </SimpleGrid>
          <Divider my="xs" label="Configuration Fields" labelPosition="left" mt={30} />

          <ConfigurationOptions config={config} setConfig={setConfig} />

          <Group justify="space-between" mt="xl">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                openModal({
                  modalId: 'newCredential',
                  title: 'Create New Credentials',
                  size: 'lg',
                  children: <CreateLocationCredentialsView reload={reload} setReload={setReload} />,
                });
              }}
            >
              Add new credentials
            </Button>
            <Button type="submit"> {mode === 'create' ? 'Create' : 'Update'}</Button>
          </Group>
        </form>
      </Box>
    </>
  );
}
