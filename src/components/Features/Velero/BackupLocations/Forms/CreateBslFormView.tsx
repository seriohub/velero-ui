import { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Group,
  TextInput,
  Select,
  SimpleGrid,
  Input,
  Space,
  Text,
  Switch,
  Card,
  Modal,
} from '@mantine/core';

import { useVeleroSecrets } from '@/api/Velero/useVeleroSecrets';
import { useVeleroSecretKey } from '@/api/Velero/useVeleroSecretKey';

import { CreateLocationCredentialsView } from '@/components/Features/Velero/Commons/Forms/CreateLocationCredentialsView';
import ConfigurationOptions from '@/components/Features/Velero/Commons/Inputs/ConfigurationOptions';
import { useDisclosure } from '@mantine/hooks';

interface CreateBslFormProps {
  form: any;
  onDone: any;
  mode: string;
}

export default function CreateBslFormView({ form, onDone, mode }: CreateBslFormProps) {
  const { data: secrets, getVeleroSecrets } = useVeleroSecrets();
  const { data: secretKeys, getVeleroSecretKey } = useVeleroSecretKey();
  const [opened, { open, close }] = useDisclosure(false);
  const [sKeys, setSeks] = useState<Record<string, any>[]>([]);
  const [reload, setReload] = useState(1);

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

  function updateConfigs(configs: any) {
    form.setFieldValue('config', configs);
  }

  return (
    <>
      <Box mx="auto">
        <form
          onSubmit={form.onSubmit((values: any) => {
            onDone(values);
          })}
        >
          <SimpleGrid cols={2} spacing="lg" verticalSpacing="xl">
            <Input.Wrapper
              label="Name"
              description="Backup Storage Location name. May be any valid Kubernetes object name"
            >
              <TextInput
                placeholder=""
                {...form.getInputProps('name')}
                disabled={mode === 'edit'}
                required
              />
            </Input.Wrapper>

            <Card withBorder radius="md">
              <Group justify="space-between" wrap="nowrap" gap={0}>
                <div>
                  <Text size="sm" fw={500}>
                    Default
                  </Text>
                  <Text size="xs" c="dimmed">
                    Set as new default
                  </Text>
                </div>
                <Switch
                  labelPosition="left"
                  defaultChecked={form.values.default}
                  {...form.getInputProps('default')}
                  radius="xs"
                />
              </Group>
            </Card>

            <Input.Wrapper
              label="Access Mode"
              description="How Velero can access the backup storage location. ReadWrite or ReadOnly"
            >
              <Select
                placeholder=""
                data={['ReadWrite', 'ReadOnly']}
                {...form.getInputProps('accessMode')}
                required
              />
            </Input.Wrapper>
            <Input.Wrapper
              label="Provider"
              description="Name for whichever object storage provider will be used to store the backups"
            >
              <TextInput placeholder="" {...form.getInputProps('provider')} required />
            </Input.Wrapper>

            <Input.Wrapper
              label="Bucket"
              description="Directory inside a storage bucket where backups are to be uploaded"
            >
              <TextInput placeholder="" {...form.getInputProps('bucket')} required />
            </Input.Wrapper>
            <Input.Wrapper
              label="Prefix"
              description="Directory inside a storage bucket where backups are to be uploaded"
            >
              <TextInput placeholder="" {...form.getInputProps('prefix')} />
            </Input.Wrapper>
          </SimpleGrid>

          <SimpleGrid cols={2} mt={20}>
            <Input.Wrapper
              label="Backup Sync Period"
              description="How frequently Velero should synchronize backups in object storage"
            >
              <TextInput placeholder="" {...form.getInputProps('backupSyncPeriod')} />
            </Input.Wrapper>

            <Input.Wrapper
              label="Validation Frequency"
              description="How frequently Velero should validate the object storage"
            >
              <TextInput {...form.getInputProps('validationFrequency')} />
            </Input.Wrapper>
          </SimpleGrid>

          <Space h={20} />
          <Card p={10} withBorder bg="transparent">
            <Text fw={600} size="sm">
              Credentials
            </Text>
            <SimpleGrid cols={2} spacing="lg" verticalSpacing="lg">
              <Input.Wrapper
                label="Secret name"
                description="Secret Name within the Velero namespace which contains the credentials"
              >
                <Select clearable data={secrets} {...form.getInputProps('credentialName')} />
              </Input.Wrapper>

              <Input.Wrapper label="Secret key" description="The key to use within the secret.">
                <Select data={sKeys} {...form.getInputProps('credentialKey')} />
              </Input.Wrapper>
            </SimpleGrid>
          </Card>

          <Space h={20} />
          <ConfigurationOptions
            config={form.values.config}
            setConfig={updateConfigs}
            label="Configs"
            description="Provider-specific configuration keys/values to be passed to the object store plugin"
          />

          <Modal
            opened={opened}
            onClose={close}
            title="Create New Credentials"
            zIndex={1000}
            centered
          >
            <CreateLocationCredentialsView reload={reload} setReload={setReload} close={close} />
          </Modal>
          <Group justify="space-between" mt="xl">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                open();
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
