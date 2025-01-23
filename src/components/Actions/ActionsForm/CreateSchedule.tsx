'use client';

import { useEffect, useState } from 'react';

import { useForm } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';

import CreateBackupScheduleForm from './CreateBackupScheduleForm';
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
    // if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 170 has been called`, `color: green; font-weight: bold;`);
    getCreationScheduleSettings();
  }, []);

  useEffect(() => {
    // if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 180 has been called`, `color: green; font-weight: bold;`);
    if (data !== undefined) {
      setNamespaces(data.payload.namespaces);
      setBackupLocation(data.payload.backup_location);
      setSnapshotLocation(data.payload.snapshot_location);
      setResources(data.payload.resources);
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
