'use client';

import { useEffect, useState } from 'react';

import { useForm } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';

import { useApiWithGet } from '@/hooks/useApiWithGet';
import { useApiWithPost } from '@/hooks/useApiWithPost';
import CreateBackupScheduleForm from './CreateBackupScheduleForm';

interface CreateScheduleProps {
  reload: number;
  setReload: any;
}

export function CreateSchedule({ reload, setReload }: CreateScheduleProps) {
  const { data, getData, error, fetching } = useApiWithGet();

  const { postData } = useApiWithPost();

  const [namespaces, setNamespaces] = useState([]);
  const [backupLocation, setBackupLocation] = useState([]);
  const [snapshotLocation, setSnapshotLocation] = useState([]);

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
    getData('/api/v1/schedule/create/settings');
  }, []);

  useEffect(() => {
    if (data !== undefined) {
      setNamespaces(data.payload.namespaces);
      setBackupLocation(data.payload.backup_location);
      setSnapshotLocation(data.payload.snapshot_location);
    }
  }, [data]);

  function createSchedule(values: any) {
    postData('/api/v1/schedule/create', {
      values,
    });
    closeAllModals();
    const interval = setInterval(() => {
      setReload(reload + 1);
      clearInterval(interval);
    }, 3000);
  }

  return (
    <CreateBackupScheduleForm
      resource="schedule"
      mode="create"
      form={form}
      namespaces={namespaces}
      backupLocation={backupLocation}
      snapshotLocation={snapshotLocation}
      onDone={createSchedule}
    />
  );
}
