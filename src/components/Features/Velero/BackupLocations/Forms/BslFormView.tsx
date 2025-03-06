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
  Stepper,
} from '@mantine/core';

import { useDisclosure } from '@mantine/hooks';
import { useVeleroSecrets } from '@/api/Velero/useVeleroSecrets';
import { useVeleroSecretKey } from '@/api/Velero/useVeleroSecretKey';

import { CreateLocationCredentialsForm } from '@/components/Features/Velero/Commons/Forms/CreateLocationCredentialsForm';
import ConfigurationOptions from '@/components/Features/Velero/Commons/Inputs/ConfigurationOptions';
import { JsonViewer } from '@/components/Features/Velero/Commons/Display/JsonViewer';
import AlertLocationEdit from '@/components/Features/Velero/Commons/Display/AlertLocationEdit';

interface CreateBslFormProps {
  form: any;
  onDone: any;
  mode: string;
}

export default function BslFormView({ form, onDone, mode }: CreateBslFormProps) {
  const { data: secrets, getVeleroSecrets } = useVeleroSecrets();
  const { data: secretKeys, getVeleroSecretKey } = useVeleroSecretKey();
  const [opened, { open, close }] = useDisclosure(false);
  const [sKeys, setSeks] = useState<Record<string, any>[]>([]);
  const [reload, setReload] = useState(1);
  const [showAlert, setShowAlert] = useState<boolean>(true);
  const [active, setActive] = useState(0);

  const nextStep = () => {
    const formErrors = form.validate();
    if (
      active === 0 &&
      Object.keys(formErrors).length &&
      (formErrors?.errors?.name ||
        formErrors?.errors?.backupSyncPeriod ||
        formErrors?.errors?.validationFrequency)
    ) {
      return;
    }
    if (
      active === 1 &&
      Object.keys(formErrors).length &&
      (formErrors?.errors?.provider ||
        formErrors?.errors?.bucket ||
        formErrors?.errors?.prefix ||
        formErrors?.errors?.credentialName ||
        formErrors?.errors?.credentialKey)
    ) {
      return;
    }
    form.clearErrors();
    setActive((current) => (current < 3 ? current + 1 : current));
  };
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

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
      form.setFieldValue('credentialKey', null);
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
          {mode === 'edit' && showAlert && <AlertLocationEdit setShowAlert={setShowAlert} />}
          <Stepper active={active} onStepClick={setActive}>
            <Stepper.Step label="Basic Configuration" description="Name, default, properties">
              <SimpleGrid cols={2} spacing="lg" verticalSpacing="xl">
                <Input.Wrapper
                  label="Name"
                  description="Backup Storage Location name. May be any valid Kubernetes object name"
                  required
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
              </SimpleGrid>
              <SimpleGrid cols={2} mt={20}>
                <Input.Wrapper
                  label="Backup Sync Period"
                  description="How frequently Velero should synchronize backups in object storage"
                  required
                >
                  <TextInput placeholder="" {...form.getInputProps('backupSyncPeriod')} />
                </Input.Wrapper>

                <Input.Wrapper
                  label="Validation Frequency"
                  description="How frequently Velero should validate the object storage"
                  required
                >
                  <TextInput {...form.getInputProps('validationFrequency')} />
                </Input.Wrapper>
              </SimpleGrid>
            </Stepper.Step>
            <Stepper.Step label="Configuration" description="access mode, bucket, credentials">
              <Input.Wrapper
                label="Access Mode"
                description="How Velero can access the backup storage location. ReadWrite or ReadOnly"
                required
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
                required
              >
                <TextInput placeholder="" {...form.getInputProps('provider')} required />
              </Input.Wrapper>

              <Input.Wrapper
                label="Bucket"
                description="Directory inside a storage bucket where backups are to be uploaded"
                required
              >
                <TextInput placeholder="" {...form.getInputProps('bucket')} required />
              </Input.Wrapper>
              <Input.Wrapper
                label="Prefix"
                description="Directory inside a storage bucket where backups are to be uploaded"
              >
                <TextInput placeholder="" {...form.getInputProps('prefix')} />
              </Input.Wrapper>

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
            </Stepper.Step>

            <Stepper.Completed>
              <Space h={20} />
              <JsonViewer record={form?.values} />
              <Text size="sm" mt={10}>
                Completed! click {mode === 'create' ? 'Create' : 'Update'} button to {mode} a backup
                storage location
              </Text>
            </Stepper.Completed>
          </Stepper>

          <Modal
            opened={opened}
            onClose={close}
            title="Create New Credentials"
            zIndex={1000}
            centered
          >
            <CreateLocationCredentialsForm reload={reload} setReload={setReload} close={close} />
          </Modal>
          <Group justify="space-between" mt="md">
            <Group>
              <Button variant="default" onClick={prevStep}>
                Back
              </Button>
              {active === 1 && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    open();
                  }}
                >
                  Add new credentials
                </Button>
              )}
            </Group>
            {active < 2 && <Button onClick={nextStep}>Next step</Button>}
            {active === 2 && (
              <Button type="submit">{mode === 'create' ? 'Create' : 'Update'}</Button>
            )}
          </Group>
        </form>
      </Box>
    </>
  );
}
