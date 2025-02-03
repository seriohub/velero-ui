'use client';

import {
  Button,
  Card,
  Group,
  Input,
  Loader,
  NumberInput,
  SimpleGrid,
  Switch,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { useWatchdogUpdateConfigs } from '@/api/Watchdog/useWatchdogUpdateConfigs';

export function WatchdogUserConfigs({ userConfiguration, setReload }: any) {
  const { handleUpdateSchedule } = useWatchdogUpdateConfigs();
  const [isModified, setIsModified] = useState(false);

  const form = useForm({
    initialValues: {
      backupEnabled: true,
      scheduleEnabled: true,
      notificationSkipCompleted: false,
      notificationSkipDeleting: false,
      notificationSkipInProgress: false,
      notificationSkipRemoved: false,
      processCycleSeconds: 300,
      expireDaysWarning: 30,
      reportBackupItemPrefix: '',
      reportScheduleItemPrefix: '',
    },

    validate: {
      processCycleSeconds: (value: number) =>
        value >= 0 && value <= 3600 ? null : 'Must be a number between 60 and 3600',
      expireDaysWarning: (value: number) =>
        value >= 0 && value <= 100 ? null : 'Must be a number between 1 and 100',
    },
  });

  const userSwitch = (title: string, description: string, item: any, formValue: any) => (
    <Group justify="space-between" wrap="nowrap" gap="xl" mt={10}>
      <div>
        <Text>{title}</Text>
        <Text size="xs" c="dimmed">
          {description}
        </Text>
      </div>
      <Switch
        defaultChecked={userConfiguration?.payload?.[item]?.toLocaleLowerCase() === 'true'}
        onLabel="ON"
        offLabel="OFF"
        size="lg"
        {...formValue}
      />
    </Group>
  );

  useEffect(() => {
    form.setFieldValue('backupEnabled', userConfiguration?.payload?.BACKUP_ENABLED);
    form.setFieldValue('scheduleEnabled', userConfiguration?.payload?.SCHEDULE_ENABLED);
    form.setFieldValue(
      'notificationSkipCompleted',
      userConfiguration?.payload?.NOTIFICATION_SKIP_COMPLETED
    );
    form.setFieldValue(
      'notificationSkipDeleting',
      userConfiguration?.payload?.NOTIFICATION_SKIP_DELETING
    );
    form.setFieldValue(
      'notificationSkipInProgress',
      userConfiguration?.payload?.NOTIFICATION_SKIP_INPROGRESS
    );
    form.setFieldValue(
      'notificationSkipRemoved',
      userConfiguration?.payload?.NOTIFICATION_SKIP_REMOVED
    );
    form.setFieldValue(
      'processCycleSeconds',
      Number(userConfiguration?.payload?.PROCESS_CYCLE_SEC)
    );
    form.setFieldValue(
      'expireDaysWarning',
      Number(userConfiguration?.payload?.EXPIRES_DAYS_WARNING)
    );
    form.setFieldValue(
      'reportBackupItemPrefix',
      userConfiguration?.payload?.REPORT_BACKUP_ITEM_PREFIX || ''
    );
    form.setFieldValue(
      'reportScheduleItemPrefix',
      userConfiguration?.payload?.REPORT_SCHEDULE_ITEM_PREFIX || ''
    );
    form.resetDirty();
  }, [userConfiguration]);

  useEffect(() => {
    if (userConfiguration) {
      setIsModified(form.isDirty());
    }
  }, [form.values]);

  function onDone(values: any) {
    handleUpdateSchedule(values).then(() => {
      setReload((prev: number) => prev + 1);
    });
    form.resetDirty();
    setIsModified(false);
  }

  if (!userConfiguration) {
    return <Loader />;
  }
  return (
    <>
      <form
        onSubmit={form.onSubmit((values: any) => {
          onDone(values);
        })}
      >
        <Card withBorder radius="md" p="xl">
          <Card.Section withBorder inheritPadding p="xs">
            <Text fz="lg" fw={500}>
              Configure notifications
            </Text>
            <Text fz="xs" c="dimmed" mt={3} mb="xl">
              Choose what notifications you want to receive
            </Text>
          </Card.Section>
          <Card.Section withBorder inheritPadding p="xs">
            <SimpleGrid
              cols={{
                base: 1,
                md: 2,
              }}
              spacing={{
                base: 10,
                sm: 'xl',
              }}
              verticalSpacing={{
                base: 'md',
                sm: 'xl',
              }}
            >
              <div>
                <Group grow>
                  <Input.Wrapper
                    label="Report prefix"
                    description="Backup item prefix"
                    mt={10}
                    // error={form.errors.reportBackupItemPrefix}
                  >
                    <Input {...form.getInputProps('reportBackupItemPrefix')} />
                  </Input.Wrapper>
                  <Input.Wrapper
                    label="Report prefix"
                    description="Schedule item prefix"
                    mt={10}
                    // error={form.errors.reportScheduleItemPrefix}
                  >
                    <Input
                      {...form.getInputProps('reportScheduleItemPrefix')}
                      //
                    />
                  </Input.Wrapper>
                </Group>
                <Group grow>
                  <Input.Wrapper
                    label="Process Cycle"
                    description="Process cycle in seconds"
                    mt={10}
                    error={form.errors.processCycleSeconds}
                  >
                    <NumberInput
                      {...form.getInputProps('processCycleSeconds')}
                      min={5}
                      max={3600}
                    />
                  </Input.Wrapper>

                  <Input.Wrapper
                    label="Expires warning"
                    description="Expires days warning"
                    mt={10}
                    error={form.errors.expireDaysWarning}
                  >
                    <NumberInput {...form.getInputProps('expireDaysWarning')} min={1} max={100} />
                  </Input.Wrapper>
                </Group>
              </div>
              <div>
                {userSwitch(
                  'Backups Enabled',
                  'Detects and notifies changes in backups',
                  'BACKUP_ENABLED',
                  form.getInputProps('backupEnabled')
                )}
                {userSwitch(
                  'Schedules Enabled',
                  'Detects and notifies changes in schedules',
                  'SCHEDULE_ENABLED',
                  form.getInputProps('scheduleEnabled')
                )}
                {userSwitch(
                  'Notification: skip completed',
                  'Do not send notifications when a backup ends with “COMPLETED” status',
                  'NOTIFICATION_SKIP_COMPLETED',
                  form.getInputProps('notificationSkipCompleted')
                )}
                {userSwitch(
                  'Notification: skip deleting',
                  'Do not send notifications when a backup has “DELETING” status',
                  'NOTIFICATION_SKIP_DELETING',
                  form.getInputProps('notificationSkipDeleting')
                )}
                {userSwitch(
                  'Notification: skip in progress',
                  'Do not send notifications when a backup has “IN PROGRESS” status',
                  'NOTIFICATION_SKIP_INPROGRESS',
                  form.getInputProps('notificationSkipInProgress')
                )}
                {userSwitch(
                  'Notification: skip removed',
                  'Do not send notifications when a backup has “REMOVED”',
                  'NOTIFICATION_SKIP_REMOVED',
                  form.getInputProps('notificationSkipRemoved')
                )}
              </div>
            </SimpleGrid>
            <Card.Section withBorder inheritPadding p="xs" mt={50}>
              <Group justify="flex-end" mt="md">
                <Button type="submit" disabled={!isModified}>
                  Save
                </Button>
              </Group>
            </Card.Section>
          </Card.Section>
        </Card>
      </form>
    </>
  );
}
