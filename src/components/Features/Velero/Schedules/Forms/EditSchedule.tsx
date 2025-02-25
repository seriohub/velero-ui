'use client';

import { useEffect, useState } from 'react';

import { useForm } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';

import CreateBackupScheduleForm from '@/components/Features/Velero/Commons/Forms/CreateBackupScheduleForm';
import { useAppStatus } from '@/contexts/AppContext';
import { useCreationScheduleSettings } from '@/api/Schedule/useScheduleSettings';
import { useUpdateSchedule } from '@/api/Schedule/useUpdateSchedule';

interface EditScheduleProps {
  record: any;
  reload: number;
  setReload: any;
}

export function EditSchedule({ record, reload, setReload }: EditScheduleProps) {
  const appValues = useAppStatus();
  const { data, getCreationScheduleSettings } = useCreationScheduleSettings();

  const { handleUpdateSchedule } = useUpdateSchedule();

  const [namespaces, setNamespaces] = useState([]);
  const [backupLocation, setBackupLocation] = useState([]);
  const [snapshotLocation, setSnapshotLocation] = useState([]);
  const [resources, setResources] = useState([]);

  const form = useForm({
    initialValues: {
      name: record.metadata.name,
      oldName: record.metadata.name,
      schedule: record.spec.schedule,
      includedNamespaces: record.spec.template.includedNamespaces,
      excludedNamespaces: record.spec.template.excludedNamespaces,
      includedResources: record.spec.template.includedResources,
      excludedResources: record.spec.template.excludedResources,
      backupRetention: record.spec.template.ttl,
      snapshotVolumes: record.spec.template.snapshotVolumes,
      includeClusterResources: record.spec.template.includeClusterResources
        ? record.spec.template.includeClusterResources.toString()
        : '',
      defaultVolumesToFsBackup: record.spec.template.defaultVolumesToFsBackup,
      backupLabel: record.spec.template.labelSelector
        ? Object.keys(record.spec.template.labelSelector.matchLabels)
        : '',
      selector: record.spec.template.labelSelector
        ? Object.values(record.spec.template.labelSelector.matchLabels)
        : '',
      backupLocation: record.spec.template.storageLocation,
      snapshotLocation: record.spec.template.volumeSnapshotLocations,
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
    handleUpdateSchedule(values);
    closeAllModals();
    const interval = setInterval(() => {
      setReload(reload + 1);
      clearInterval(interval);
    }, appValues.refreshDatatableAfter);
  }

  return (
    <CreateBackupScheduleForm
      resource="schedule"
      mode="edit"
      form={form}
      namespaces={namespaces}
      backupLocation={backupLocation}
      snapshotLocation={snapshotLocation}
      resources={resources}
      onDone={createSchedule}
    />
  );
}
