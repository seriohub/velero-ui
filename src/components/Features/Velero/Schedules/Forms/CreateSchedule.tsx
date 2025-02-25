'use client';

import { useEffect, useState } from 'react';

import { useForm } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';

import CreateBackupScheduleForm from '@/components/Features/Velero/Commons/Forms/CreateBackupScheduleForm';
import { useAppStatus } from '@/contexts/AppContext';
import { useCreationScheduleSettings } from '@/api/Schedule/useScheduleSettings';
import { useCreateSchedule } from '@/api/Schedule/useCreateSchedule';

interface CreateScheduleProps {
  reload: number;
  setReload: any;
}

export function CreateSchedule({ reload, setReload }: CreateScheduleProps) {
  const appValues = useAppStatus();
  const { data, getCreationScheduleSettings } = useCreationScheduleSettings();

  const { handleCreateSchedule } = useCreateSchedule();

  const [namespaces, setNamespaces] = useState([]);
  const [backupLocation, setBackupLocation] = useState([]);
  const [snapshotLocation, setSnapshotLocation] = useState([]);
  const [resources, setResources] = useState([]);

  const form = useForm({
    initialValues: {
      name: '',
      schedule: '0 * * * *',
      includedNamespaces: [],
      excludedNamespaces: [],
      includedResources: [],
      excludedResources: [],
      backupRetention: '720h0m0s',
      snapshotVolumes: false,
      includeClusterResources: false,
      defaultVolumesToFsBackup: false,
      backupLabel: '',
      selector: '',
      backupLocation: '',
      snapshotLocation: [],
    },

    validate: {
      name: (value) => (value.length === 0 ? 'Invalid name' : null),
    },
  });

  useEffect(() => {
    getCreationScheduleSettings();
  }, []);

  useEffect(() => {
    if (data !== undefined) {
      setNamespaces(data.namespaces);
      setBackupLocation(data.backup_location);
      setSnapshotLocation(data.snapshot_location);
      setResources(data.resources);
    }
  }, [data]);

  function createSchedule(values: any) {
    handleCreateSchedule(values);
    closeAllModals();
    const interval = setInterval(() => {
      setReload(reload + 1);
      clearInterval(interval);
    }, appValues.refreshDatatableAfter);
  }

  return (
    <CreateBackupScheduleForm
      resource="schedule"
      mode="create"
      form={form}
      namespaces={namespaces}
      backupLocation={backupLocation}
      snapshotLocation={snapshotLocation}
      resources={resources}
      onDone={createSchedule}
    />
  );
}
