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
  useComputedColorScheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';

import { useWatchdogUpdateConfigs } from '@/api/Watchdog/useWatchdogUpdateConfigs';

export function WatchdogUserConfigs({ userConfiguration, setReload }: any) {
  const { handleUpdateSchedule } = useWatchdogUpdateConfigs();
  const [isModified, setIsModified] = useState(false);
  const computedColorScheme = useComputedColorScheme();
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
        defaultChecked={userConfiguration?.[item]?.toLocaleLowerCase() === 'true'}
        //onLabel="ON"
        //offLabel="OFF"
        radius="xs"
        {...formValue}
      />
    </Group>
  );

  useEffect(() => {
    form.setFieldValue('backupEnabled', userConfiguration?.BACKUP_ENABLED);
    form.setFieldValue('scheduleEnabled', userConfiguration?.SCHEDULE_ENABLED);
    form.setFieldValue('notificationSkipCompleted', userConfiguration?.NOTIFICATION_SKIP_COMPLETED);
    form.setFieldValue('notificationSkipDeleting', userConfiguration?.NOTIFICATION_SKIP_DELETING);
    form.setFieldValue(
      'notificationSkipInProgress',
      userConfiguration?.NOTIFICATION_SKIP_INPROGRESS
    );
    form.setFieldValue('notificationSkipRemoved', userConfiguration?.NOTIFICATION_SKIP_REMOVED);
    form.setFieldValue('processCycleSeconds', Number(userConfiguration?.PROCESS_CYCLE_SEC));
    form.setFieldValue('expireDaysWarning', Number(userConfiguration?.EXPIRES_DAYS_WARNING));
    form.setFieldValue(
      'reportBackupItemPrefix',
      userConfiguration?.REPORT_BACKUP_ITEM_PREFIX || ''
    );
    form.setFieldValue(
      'reportScheduleItemPrefix',
      userConfiguration?.REPORT_SCHEDULE_ITEM_PREFIX || ''
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
    <form
      onSubmit={form.onSubmit((values: any) => {
        onDone(values);
      })}
    >
      <Card
        radius="xs"
        maw={1000}
        withBorder
        mt={10}
        p="xl"
        bg={computedColorScheme === 'light' ? '' : 'var(--mantine-color-body)'}
      >
        <Text fz="lg" fw={500}>
          Configure notifications
        </Text>
        <Text fz="xs" c="dimmed">
          Choose what notifications you want to receive
        </Text>

        <SimpleGrid
          mt={10}
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
          <div>
            <Input.Wrapper
              label="Report prefix"
              description="Backup item prefix"
              mt={10}
              // error={form.errors.reportBackupItemPrefix}
            >
              <Input {...form.getInputProps('reportBackupItemPrefix')} />
            </Input.Wrapper>
            <Input.Wrapper label="Report prefix" description="Schedule item prefix" mt={10}>
              <Input {...form.getInputProps('reportScheduleItemPrefix')} />
            </Input.Wrapper>

            <Input.Wrapper
              label="Process Cycle"
              description="Process cycle in seconds"
              mt={10}
              error={form.errors.processCycleSeconds}
            >
              <NumberInput {...form.getInputProps('processCycleSeconds')} min={5} max={3600} />
            </Input.Wrapper>

            <Input.Wrapper
              label="Expires warning"
              description="Expires days warning"
              mt={10}
              error={form.errors.expireDaysWarning}
            >
              <NumberInput {...form.getInputProps('expireDaysWarning')} min={1} max={100} />
            </Input.Wrapper>
          </div>
        </SimpleGrid>

        <Group justify="flex-end" mt={20}>
          <Button type="submit" disabled={!isModified}>
            Save
          </Button>
        </Group>
      </Card>
    </form>
  );
}
