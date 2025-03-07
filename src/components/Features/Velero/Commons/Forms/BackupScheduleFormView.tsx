import cron from 'cron-validate';
import { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Group,
  TextInput,
  SimpleGrid,
  MultiSelect,
  Input,
  SegmentedControl,
  Select,
  Text,
  Switch,
  Card,
  Center,
  Space,
  NumberInput,
  Stepper,
} from '@mantine/core';

import { MultiSelectCreatable } from '@/components/Features/Velero/Backups/Inputs/MultiSelectCreatable';
import { SearchableMultiSelect } from '@/components/Inputs/SearchableMultiSelect';
import ConfigurationOptions from '@/components/Features/Velero/Commons/Inputs/ConfigurationOptions';
import { JsonViewer } from '@/components/Features/Velero/Commons/Display/JsonViewer';

interface CreateBackupScheduleFormProps {
  resource: string;
  form: any;
  namespaces: string[];
  backupLocation: string[];
  snapshotLocation: string[];
  resources: string[];
  resourcePolicy: string[];
  onDone: any;
  mode: string;
}

export default function BackupScheduleFormView({
  resource,
  form,
  namespaces,
  backupLocation = [],
  snapshotLocation = [],
  resources = [],
  resourcePolicy = [],
  onDone,
  mode,
}: CreateBackupScheduleFormProps) {
  const [active, setActive] = useState(0);
  const nextStep = () => {
    form.validate();
    if (form.isValid()) {
      setActive((current) => (current < 3 ? current + 1 : current));
    }
  };
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const defaultValue = '0 * * * *';
  const [value, setValue] = useState(resource === 'schedule' ? form.values.schedule : defaultValue);

  const [cronError, setCronError] = useState(false);
  useEffect(() => {
    if (resource === 'schedule') {
      form.setFieldValue('schedule', value);
    }
  }, [value]);

  function ValdateCron(cronStr: string) {
    setValue(cronStr);
    const cronResult = cron(cronStr);
    if (cronResult.isValid()) {
      setCronError(false);
    } else {
      setCronError(true);
    }
  }

  function capitalize(s: string) {
    return String(s[0]).toUpperCase() + String(s).slice(1);
  }

  return (
    <>
      <Box mx="auto">
        <form
          onSubmit={form.onSubmit((values: any) => {
            onDone(values);
          })}
        >
          <Stepper active={active} onStepClick={setActive}>
            <Stepper.Step
              label="Basic Configuration"
              description="Name, TTL, properties, destination"
            >
              <SimpleGrid cols={2}>
                <Input.Wrapper
                  label="Name"
                  description={`${capitalize(resource)} Name. May be any valid Kubernetes object name. Required`}
                >
                  <TextInput
                    required
                    placeholder=""
                    {...form.getInputProps('name')}
                    disabled={mode === 'edit'}
                  />
                </Input.Wrapper>
                <Input.Wrapper
                  label="TTL"
                  description="The amount of time before this backup is eligible for garbage collection"
                >
                  <TextInput {...form.getInputProps('ttl')} />
                </Input.Wrapper>
              </SimpleGrid>

              {resource === 'schedule' && (
                <SimpleGrid cols={2} mt={20}>
                  <Box>
                    <Input.Wrapper
                      label="Schedule"
                      description="Cron expression defining when to run the Backup"
                    >
                      <TextInput
                        value={value}
                        onChange={(event) => ValdateCron(event.currentTarget.value)}
                        error={cronError}
                      />
                    </Input.Wrapper>
                  </Box>

                  <Card withBorder radius="md" p={10}>
                    <Group justify="space-between" wrap="nowrap" gap={0}>
                      <div>
                        <Text size="sm" fw={500}>
                          Owner References
                        </Text>
                        <Text size="xs" c="dimmed">
                          Specifies whether to use OwnerReferences on backups created by this
                          Schedule
                        </Text>
                      </div>
                      <Switch
                        labelPosition="left"
                        defaultChecked={form.values.useOwnerReferencesInBackup === true}
                        {...form.getInputProps('useOwnerReferencesInBackup')}
                        radius="xs"
                      />
                    </Group>
                    <Group justify="space-between" wrap="nowrap" gap={0} mt={5}>
                      <div>
                        <Text size="sm" fw={500}>
                          Paused
                        </Text>
                        <Text size="xs" c="dimmed">
                          Paused specifies whether the schedule is paused or not
                        </Text>
                      </div>
                      <Switch
                        labelPosition="left"
                        defaultChecked={form.values.paused === true}
                        {...form.getInputProps('paused')}
                        radius="xs"
                      />
                    </Group>
                  </Card>
                </SimpleGrid>
              )}

              <SimpleGrid cols={2} mt={20}>
                <Input.Wrapper
                  label="Backup Storage Location"
                  description="Where to store the tarball and logs"
                >
                  <Select
                    placeholder=""
                    data={backupLocation}
                    {...form.getInputProps('storageLocation')}
                    defaultValue={form.values.storageLocation}
                  />
                </Input.Wrapper>

                <Input.Wrapper
                  label="Volume Snapshot Location"
                  description="List of locations in which to store volume snapshots created for this backup"
                >
                  <MultiSelect
                    placeholder=""
                    data={snapshotLocation}
                    {...form.getInputProps('volumeSnapshotLocations')}
                    defaultValue={form.values.volumeSnapshotLocations}
                  />
                </Input.Wrapper>
              </SimpleGrid>

              <SimpleGrid cols={1} mt={20}>
                <Card withBorder radius="md" p={10}>
                  <Group justify="space-between" wrap="nowrap" gap={0}>
                    <div>
                      <Text size="sm" fw={500}>
                        Snapshot Volumes
                      </Text>
                      <Text size="xs" c="dimmed">
                        Take snapshots of persistent volume in a Velero backup
                      </Text>
                    </div>
                    <SegmentedControl
                      mt={10}
                      style={{ width: '300px' }}
                      transitionDuration={200}
                      color="var(--mantine-primary-color-filled)"
                      value={
                        form.values.snapshotVolumes === true
                          ? 'true'
                          : form.values.snapshotVolumes === false
                            ? 'false'
                            : 'null'
                      }
                      onChange={(val) =>
                        form.setFieldValue(
                          'snapshotVolumes',
                          val === 'true' ? true : val === 'false' ? false : null
                        )
                      }
                      data={[
                        {
                          label: 'Auto',
                          value: 'null',
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
                  </Group>

                  <Group justify="space-between" wrap="nowrap" gap={0} mt={10}>
                    <div>
                      <Text size="sm" fw={500}>
                        Default Volume to Fs Backup
                      </Text>
                      <Text size="xs" c="dimmed">
                        Enables file-system-based backup for persistent volumes by default
                      </Text>
                    </div>
                    <Switch
                      labelPosition="left"
                      defaultChecked={form.values.defaultVolumesToFsBackup === true}
                      {...form.getInputProps('defaultVolumesToFsBackup')}
                      radius="xs"
                    />
                  </Group>
                  <Group justify="space-between" wrap="nowrap" gap={0} mt={10}>
                    <div>
                      <Text size="sm" fw={500}>
                        Snapshot Move Data
                      </Text>
                      <Text size="xs" c="dimmed">
                        Indicate if snapshot data should be relocated
                      </Text>
                    </div>
                    <Switch
                      labelPosition="left"
                      defaultChecked={form.values.snapshotMoveData === true}
                      {...form.getInputProps('snapshotMoveData')}
                      radius="xs"
                    />
                  </Group>
                </Card>
              </SimpleGrid>
            </Stepper.Step>
            <Stepper.Step label="Content Selection" description="Namespaces, resources">
              <SimpleGrid cols={2} mt={20}>
                <SearchableMultiSelect
                  label="Include Namespaces"
                  content={namespaces}
                  form={form}
                  fieldName="includedNamespaces"
                  initialValue={form.values.includedNamespaces}
                  description="Namespaces to include in the backup. If unspecified, all namespaces are included"
                />
                <SearchableMultiSelect
                  label="Exclude Namespaces"
                  content={namespaces}
                  form={form}
                  fieldName="excludedNamespaces"
                  initialValue={form.values.excludedNamespaces}
                  description="Namespaces to exclude from the backup"
                />
              </SimpleGrid>
              <SimpleGrid cols={2} mt={20}>
                <MultiSelectCreatable
                  label="Include Resources"
                  content={resources}
                  form={form}
                  fieldName="includedResources"
                  initalValue={form.values.includedResources}
                  description="Resources to include in the backup. Resources may be shortcuts"
                />

                <MultiSelectCreatable
                  label="Exclude Resources"
                  content={resources}
                  form={form}
                  fieldName="excludedResources"
                  initalValue={form.values.excludedResources}
                  description="Resources to exclude from the backup"
                />
              </SimpleGrid>

              <SimpleGrid cols={2} mt={20}>
                <Input.Wrapper
                  label="Resource Policy"
                  description="Specifies the referenced resource policies that backup should follow"
                >
                  <Select
                    placeholder=""
                    clearable
                    data={resourcePolicy}
                    {...form.getInputProps('resourcePolicy')}
                    defaultValue={form.values.resourcePolicy}
                  />
                </Input.Wrapper>
              </SimpleGrid>

              <Card withBorder radius="md" p={10} mt={22}>
                <Group justify="space-between" wrap="nowrap" gap={0}>
                  <div>
                    <Text size="sm" fw={500}>
                      Include Cluster Resources
                    </Text>
                    <Text size="xs" c="dimmed">
                      Whether to include cluster-scoped resources
                    </Text>
                  </div>

                  <SegmentedControl
                    mt={10}
                    style={{ width: '300px' }}
                    transitionDuration={200}
                    color="var(--mantine-primary-color-filled)"
                    value={
                      form.values.includeClusterResources === true
                        ? 'true'
                        : form.values.includeClusterResources === false
                          ? 'false'
                          : 'null'
                    }
                    onChange={(val) =>
                      form.setFieldValue(
                        'includeClusterResources',
                        val === 'true' ? true : val === 'false' ? false : null
                      )
                    }
                    data={[
                      {
                        label: 'Auto',
                        value: 'null',
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
                </Group>
              </Card>

              <Space h={20} />
              <ConfigurationOptions
                label="Label Selector"
                description="Objects must match this label selector to be included in the backup"
                config={form.values.labelSelector}
                setConfig={(labelSelector: any) =>
                  form.setFieldValue('labelSelector', labelSelector)
                }
              />
            </Stepper.Step>
            <Stepper.Step
              label="Process Settings"
              description="Timeout, parallel file upload options"
            >
              <SimpleGrid cols={2} mt={20}>
                <Input.Wrapper
                  label="Data mover"
                  description="To be used by the backup. Default value is '' or 'velero'"
                >
                  <TextInput placeholder="" {...form.getInputProps('datamover')} />
                </Input.Wrapper>
                <Input.Wrapper
                  label="Parallel Files Upload"
                  description="Is the number of files parallel uploads to perform when using the uploader"
                >
                  <NumberInput {...form.getInputProps('parallelFilesUpload')} />
                </Input.Wrapper>
              </SimpleGrid>

              <SimpleGrid cols={2} mt={20}>
                <Input.Wrapper
                  label="CSI Snapshot Timeout"
                  description="Time used to wait for CSI VolumeSnapshot status turns to ReadyToUse"
                >
                  <TextInput placeholder="" {...form.getInputProps('csiSnapshotTimeout')} />
                </Input.Wrapper>
                {resource === 'backup' && (
                  <Input.Wrapper
                    label="Item Operation Timeout"
                    description="Time used to wait for asynchronous BackupItemAction operations"
                  >
                    <TextInput {...form.getInputProps('itemOperationTimeout')} />
                  </Input.Wrapper>
                )}
              </SimpleGrid>
            </Stepper.Step>

            <Stepper.Completed>
              <JsonViewer record={form?.values} />
              <Text size="sm" mt={10}>
                Completed! click create button to create a {resource}
              </Text>
            </Stepper.Completed>
          </Stepper>
          <Group justify="space-between" mt="md">
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
            {active < 3 && <Button onClick={nextStep}>Next step</Button>}
            {active === 3 && (
              <Button type="submit"> {mode === 'create' ? 'Create' : 'Update'}</Button>
            )}
          </Group>
        </form>
      </Box>
    </>
  );
}
