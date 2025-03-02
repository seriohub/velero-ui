import {
  Box,
  Button,
  Group,
  TextInput,
  SimpleGrid,
  Input,
  SegmentedControl,
  Text,
  Switch,
  Card,
  Center,
  Space,
  NumberInput,
} from '@mantine/core';

import { useState } from 'react';
import { MultiSelectCreatable } from '@/components/Features/Velero/Backups/Inputs/MultiSelectCreatable';
import { SearchableMultiSelect } from '@/components/Inputs/SearchableMultiSelect';
import ConfigurationOptions from '@/components/Features/Velero/Commons/Inputs/ConfigurationOptions';
import RestoreAlert from '@/components/Features/Velero/Restores/Form/RestoreAlert';

interface CreateRestoreFormProps {
  form: any;
  namespaces: string[];
  resources: string[];
  onDone: any;
}

export default function RestoreFormView({
  form,
  namespaces,
  resources = [],
  onDone,
}: CreateRestoreFormProps) {
  const [checked, setChecked] = useState(false);

  return (
    <>
      <Box mx="auto">
        <form
          onSubmit={form.onSubmit((values: any) => {
            onDone(values);
          })}
        >
          <RestoreAlert backupName={form.values.backupName} visible={checked} />

          <SimpleGrid cols={2}>
            <Input.Wrapper
              label="Name"
              required
              description="Restore name. May be any valid Kubernetes object name"
            >
              <TextInput required placeholder="" {...form.getInputProps('name')} />
            </Input.Wrapper>
            <Input.Wrapper
              label="Backup Name"
              description="The unique name of the Velero backup to restore fromd"
            >
              <TextInput {...form.getInputProps('backupName')} disabled />
            </Input.Wrapper>
          </SimpleGrid>

          <SimpleGrid cols={2} mt={20}>
            <SearchableMultiSelect
              label="Include Namespacess"
              content={namespaces}
              form={form}
              fieldName="includedNamespaces"
              initialValue={form.values.includedNamespaces}
              description="Namespaces to include in the restore. If unspecified, all namespaces are included"
            />
            <SearchableMultiSelect
              label="Exclude Namespaces"
              content={namespaces}
              form={form}
              fieldName="excludedNamespaces"
              initialValue={form.values.excludedNamespaces}
              description="Namespaces to exclude from the restore"
            />
          </SimpleGrid>
          <SimpleGrid cols={2} mt={20}>
            <MultiSelectCreatable
              label="Include Resources"
              content={resources}
              form={form}
              fieldName="includedResources"
              initalValue={form.values.includedResources}
              description="Resources to exclude from the restore. Resources may be shortcuts"
            />

            <MultiSelectCreatable
              label="Exclude Resources"
              content={resources}
              form={form}
              fieldName="excludedResources"
              initalValue={form.values.excludedResources}
              description="Resources to exclude from the restore. Resources may be shortcuts"
            />
          </SimpleGrid>

          <SimpleGrid cols={2} mt={20}>
            <Card withBorder radius="md" p={10}>
              <Group justify="space-between" wrap="nowrap" gap={0}>
                <div>
                  <Text size="sm" fw={500}>
                    RestorePVs
                  </Text>
                  <Text size="xs" c="dimmed">
                    Specifies whether to restore all included PVs
                  </Text>
                </div>
                <Switch
                  labelPosition="left"
                  defaultChecked={form.values.restorePVs}
                  {...form.getInputProps('snapshotVolumes')}
                  radius="xs"
                />
              </Group>
              <Group justify="space-between" wrap="nowrap" gap={0} mt={5}>
                <div>
                  <Text size="sm" fw={500}>
                    Preserve NodePorts
                  </Text>
                  <Text size="xs" c="dimmed">
                    Specifies whether to restore old nodePorts from backup
                  </Text>
                </div>
                <Switch
                  labelPosition="left"
                  defaultChecked={form.values.preserveNodePorts}
                  {...form.getInputProps('paused')}
                  radius="xs"
                />
              </Group>
              <Group justify="space-between" wrap="nowrap" gap={0} mt={5}>
                <div>
                  <Text size="sm" fw={500}>
                    Write Sparse Files
                  </Text>
                  <Text size="xs" c="dimmed">
                    Indicate whether write files sparsely or not
                  </Text>
                </div>
                <Switch
                  labelPosition="left"
                  defaultChecked={form.values.writeSparseFiles}
                  {...form.getInputProps('paused')}
                  radius="xs"
                />
              </Group>
            </Card>
            <Box>
              <Card withBorder radius="md" p={5}>
                <Input.Wrapper
                  label="Include Cluster Resources"
                  description="Whether or not to include cluster-scoped resources"
                >
                  <Center>
                    <SegmentedControl
                      mt={10}
                      style={{ width: '300px' }}
                      transitionDuration={200}
                      color="var(--mantine-primary-color-filled)"
                      value={form.values.includeClusterResources}
                      {...form.getInputProps('includeClusterResources')}
                      data={[
                        {
                          label: 'Auto',
                          value: '',
                        },
                        {
                          label: 'True',
                          value: 'true',
                        },
                        {
                          label: 'False',
                          value: 'false',
                        },
                      ]}
                    />
                  </Center>
                </Input.Wrapper>
              </Card>
            </Box>
          </SimpleGrid>

          <SimpleGrid cols={2} mt={20}>
            <Input.Wrapper
              label="Item Operation Timeout"
              description="Specifies the time used to wait for asynchronous BackupItemAction operations"
            >
              <TextInput {...form.getInputProps('itemOperationTimeout')} />
            </Input.Wrapper>
            <Input.Wrapper
              label="Parallel Files Upload"
              description="The concurrency number setting for restore"
            >
              <NumberInput {...form.getInputProps('parallelFilesUpload')} />
            </Input.Wrapper>
          </SimpleGrid>

          <Space h={20} />

          <ConfigurationOptions
            label="Mapping Namespaces"
            config={form.values.namespaceMapping}
            setConfig={(namespaceMapping: any) =>
              form.setFieldValue('namespaceMapping', namespaceMapping)
            }
            labelKey="Backuped Namespace"
            labelValue="New Namespace"
            description="Is a map of source namespace names to target namespace names to restore into"
          />
          <Space h={20} />
          <ConfigurationOptions
            label="Label Selector"
            config={form.values.labelSelector}
            setConfig={(labelSelector: any) => form.setFieldValue('labelSelector', labelSelector)}
            description="Individual objects must match this label selector to be included in the restore"
          />

          <Group justify="space-between" mt="md">
            <Switch
              labelPosition="right"
              checked={checked}
              onChange={(event) => setChecked(event.currentTarget.checked)}
              radius="xs"
              label="Show info"
            />
            <Button type="submit">Create</Button>
          </Group>
        </form>
      </Box>
    </>
  );
}
