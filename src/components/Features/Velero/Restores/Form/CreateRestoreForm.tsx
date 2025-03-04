import { useEffect, useState } from 'react';

import { closeAllModals } from '@mantine/modals';

import { useForm } from '@mantine/form';

import { useCreateRestore } from '@/api/Restore/useCreateRestore';

import RestoreFormView from '@/components/Features/Velero/Restores/Form/RestoreFormView';
import { useCreationBackupSettings } from '@/api/Backup/useBackupSettings';
import { useAppStatus } from '@/contexts/AppContext';

interface RestoreBackupProps {
  backupName: string;
  setReload: React.Dispatch<React.SetStateAction<number>>;
}

const timeoutRegex = /^\d+[smh]$/;

export function CreateRestoreForm({ backupName, setReload }: RestoreBackupProps) {
  const { handleCreateRestore } = useCreateRestore();
  const appValues = useAppStatus();

  // const { data: manifest, getResourceDescribe } = useResourceDescribe();

  const { data, getCreationBackupSettings } = useCreationBackupSettings();
  const [namespaces, setNamespaces] = useState([]);
  // const [backupLocation, setBackupLocation] = useState([]);
  // const [snapshotLocation, setSnapshotLocation] = useState([]);
  const [resources, setResources] = useState([]);

  const form = useForm({
    initialValues: {
      // metadata
      name: '',

      // spec
      backupName,
      scheduleName: '',
      itemOperationTimeout: '4h',
      namespaceMapping: {},
      includedNamespaces: [],
      excludedNamespaces: [],
      includedResources: [],
      excludedResources: [],
      includeClusterResources: null,
      restorePVs: true,
      preserveNodePorts: true,

      // spec.labelselector
      labelSelector: {},
      parallelFilesUpload: 10,
      writeSparseFiles: true,
    },

    validate: {
      name: (value) => (value.length >= 3 ? null : 'Name must be at least 3 characters long'),
      parallelFilesUpload: (value) => (Number.isInteger(value) ? null : 'Value must be an integer'),
      itemOperationTimeout: (value) =>
        timeoutRegex.test(value)
          ? null
          : 'Invalid format. Expected a number followed by s, m, or h',
    },
  });

  useEffect(() => {
    getCreationBackupSettings();
    //getResourceDescribe('backup', backupName); // object
  }, []);

  useEffect(() => {
    if (data !== undefined) {
      setNamespaces(data.namespaces);
      // setBackupLocation(data.backup_location);
      // setSnapshotLocation(data.snapshot_location);
      setResources(data.resources);
    }
  }, [data]);

  function createRestore(values: any) {
    //console.log(values)
    handleCreateRestore(values);
    closeAllModals();
    const interval = setInterval(() => {
      setReload((prev) => prev + 1);
      clearInterval(interval);
    }, appValues.refreshDatatableAfter);
  }

  return (
    <RestoreFormView
      form={form}
      namespaces={namespaces}
      resources={resources}
      onDone={createRestore}
      // manifest={manifest}
    />
  );
}
