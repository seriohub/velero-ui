import cron from 'cron-validate';
import { useEffect, useState } from 'react';

import {
  Box,
  Grid,
  Button,
  Group,
  TextInput,
  Divider,
  SimpleGrid,
  MultiSelect,
  Input,
  InputLabel,
  Chip,
  SegmentedControl,
  Select,
  Stack,
  Text,
} from '@mantine/core';

import { MultiSelectCreatable } from '@/components/MultiSelectCreatable';

interface CreateBackupScheduleFormProps {
  resource: string;
  form: any;
  namespaces: string[];
  backupLocation: string[];
  snapshotLocation: string[];
  resources: string[];
  onDone: any;
  mode: string;
}

export default function CreateBackupScheduleForm({
  resource,
  form,
  namespaces,
  backupLocation = [],
  snapshotLocation = [],
  resources = [],
  onDone,
  mode,
}: CreateBackupScheduleFormProps) {
  const defaultValue = '0 * * * *';
  const [value, setValue] = useState(resource === 'schedule' ? form.values.schedule : defaultValue);

  const [cronError, setCronError] = useState(false);
  useEffect(() => {
    // if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 160 has been called`, `color: green; font-weight: bold;`)
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

  //if (backupLocation.length === 0 || snapshotLocation.length === 0) return <></>;

  return (
    <>
      <Box mx="auto">
        <form
          onSubmit={form.onSubmit((values: any) => {
            onDone(values);
          })}
        >
          <TextInput
            label="Name"
            placeholder=""
            {...form.getInputProps('name')}
            disabled={mode === 'edit'}
          />
          {resource === 'schedule' && (
            <>
              <Divider my="sm" />
              <Text size="sm">Schedule</Text>
              <TextInput
                value={value}
                onChange={(event) => ValdateCron(event.currentTarget.value)}
                error={cronError}
              />
            </>
          )}
          <Divider my="sm" />
          <SimpleGrid cols={2}>
            <MultiSelect
              label="Include Namespaces"
              placeholder=""
              data={namespaces}
              {...form.getInputProps('includedNamespaces')}
            />
            <MultiSelectCreatable
              label="Include Resources"
              content={resources}
              form={form}
              fieldName="includedResources"
              defaultValue={form.values.includedResources}
            />
            <MultiSelect
              label="Exclude Namespaces"
              placeholder=""
              data={namespaces}
              {...form.getInputProps('excludedNamespaces')}
            />
            <MultiSelectCreatable
              label="Exclude Resources"
              content={resources}
              form={form}
              fieldName="excludedResources"
              defaultValue={form.values.excludedResources}
            />
          </SimpleGrid>
          <Grid mt={20}>
            <Grid.Col span={4}>
              <Input.Wrapper label="Backup Retention">
                <Input {...form.getInputProps('backupRetention')} />
              </Input.Wrapper>
            </Grid.Col>
            <Grid.Col span={8}>
              <InputLabel>Settings:</InputLabel>
              <Stack>
                <Chip
                  defaultChecked={form.values.snapshotVolumes === true}
                  {...form.getInputProps('snapshotVolumes')}
                >
                  Snapshot Volumes
                </Chip>

                <Chip
                  defaultChecked={form.values.defaultVolumesToFsBackup === true}
                  {...form.getInputProps('defaultVolumesToFsBackup')}
                >
                  Default Volume to Fs Backup
                </Chip>

                <Box>
                  <Text size="sm" fw={500}>
                    Include Cluster Resources:
                  </Text>
                  <SegmentedControl
                    style={{ width: '300px' }}
                    transitionDuration={200}
                    color="blue"
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
                </Box>
              </Stack>
            </Grid.Col>
          </Grid>

          <Divider my="sm" />
          <SimpleGrid cols={2}>
            <Input.Wrapper label="Backup Labels">
              <Input {...form.getInputProps('backupLabel')} />
            </Input.Wrapper>
            <Input.Wrapper label="Use Selector">
              <Input {...form.getInputProps('selector')} />
            </Input.Wrapper>
            <Select
              label="Backup Storage Location"
              placeholder=""
              data={backupLocation}
              {...form.getInputProps('backupLocation')}
            />

            <MultiSelect
              label="Volume Snapshot Location"
              placeholder=""
              data={snapshotLocation}
              {...form.getInputProps('snapshotLocation')}
            />
          </SimpleGrid>

          <Group justify="flex-end" mt="md">
            <Button type="submit"> {mode === 'create' ? 'Create' : 'Update'}</Button>
          </Group>
        </form>
      </Box>
    </>
  );
}
