import { useEffect, useState } from 'react';

import { openModal } from '@mantine/modals';
import { Box, Button, Group, TextInput, Divider, Select, SimpleGrid } from '@mantine/core';

import { useVeleroSecrets } from '@/api/Velero/useVeleroSecrets';
import { useVeleroSecretKey } from '@/api/Velero/useVeleroSecretKey';

import { CreateLocationCredentials } from '@/components/Actions/ActionsForm/CreateLocationCredentials';
import BslConfigurationTable from '@/components/Inputs/BslConfigurationTable';

interface CreateBslFormProps {
  form: any;
  onDone: any;
  mode: string;
}

export default function CreateBslForm({
  form,

  onDone,
  mode,
}: CreateBslFormProps) {
  const { data: secrets, getVeleroSecrets } = useVeleroSecrets();
  const { data: secretKeys, getVeleroSecretKey } = useVeleroSecretKey();

  const [sKeys, setSeks] = useState([]);
  const [config, setConfig] = useState([]);
  const [reload, setReload] = useState(1);

  useEffect(() => {
    form.setFieldValue('config', config);
  }, [config]);

  useEffect(() => {
    getVeleroSecrets();
  }, [reload]);

  useEffect(() => {
    setSeks(secretKeys?.payload);
  }, [secretKeys]);

  useEffect(() => {
    if (form.values.credentialSecretName) {
      getVeleroSecretKey(form.values.credentialSecretName);
    } else {
      form.setFieldValue('credentialKey', '');
      setSeks([]);
    }
  }, [form.values.credentialSecretName]);

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
              label="Backup Storage Location name"
              placeholder=""
              {...form.getInputProps('name')}
              disabled={mode === 'edit'}
              required
            />

            <Select
              label="Access Mode"
              placeholder=""
              data={['ReadWrite', 'ReadOnly']}
              {...form.getInputProps('accessMode')}
              required
            />

            <TextInput
              label="Provider"
              placeholder=""
              {...form.getInputProps('provider')}
              required
            />

            <TextInput
              label="Bucket Name"
              placeholder=""
              {...form.getInputProps('bucketName')}
              required
            />
          </SimpleGrid>
          <Divider my="xs" label="Credentials" labelPosition="left" mt={30} />
          <SimpleGrid cols={2} spacing="lg" verticalSpacing="lg">
            <Select
              clearable
              label="Credential secret name"
              data={secrets?.payload}
              {...form.getInputProps('credentialSecretName')}
            />

            <Select label="Credential key" data={sKeys} {...form.getInputProps('credentialKey')} />

            {/*<Switch
              label="Set as new default"
              checked={form.values.default}
              onChange={() => form.setFieldValue(!form.values.default)}
              {...form.getInputProps('default')}
            />*/}
          </SimpleGrid>
          <Divider my="xs" label="Configuration Fields" labelPosition="left" mt={30} />

          {/*<Group grow>
            <BslConfigurationField />
            <TextInput />
          </Group>*/}
          <BslConfigurationTable config={config} setConfig={setConfig} />

          {/*<TextInput label="Region" placeholder="" {...form.getInputProps('region')} />
          <TextInput label="s3Url" placeholder="" {...form.getInputProps('s3Url')} />*/}

          <Group justify="space-between" mt="xl">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                openModal({
                  modalId: 'newCredential',
                  title: 'Create New Credentials',
                  size: 'lg',
                  children: <CreateLocationCredentials reload={reload} setReload={setReload} />,
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
