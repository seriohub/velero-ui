import { useForm } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';

import { useAppStatus } from '@/contexts/AppContext';

import BslFormView from '@/components/Features/Velero/BackupLocations/Forms/BslFormView';
import { useUpdateBsl } from '@/api/BackupLocation/useUpdateBsl';

interface EditBslProps {
  record: any;
  setReload: any;
}

const ttlRegex = /^(\d+h)?(\d+m)?(\d+s)?$/;

export function EditBslForm({ record, setReload }: EditBslProps) {
  const appValues = useAppStatus();

  const { handleUpdateBsl } = useUpdateBsl();

  const form = useForm({
    initialValues: {
      name: record?.metadata?.name,

      provider: record?.spec?.provider,
      bucket: record?.spec?.objectStorage?.bucket,
      prefix: record?.spec?.objectStorage?.prefix || null,
      accessMode: record?.spec?.accessMode,

      config: record?.spec?.config || {},

      credentialName: record?.spec?.credential?.name || null,
      credentialKey: record?.spec?.credential?.key || null,

      backupSyncPeriod: record?.spec?.backupSyncPeriod,
      validationFrequency: record?.spec?.validationFrequency,

      default: false,
    },

    validate: {
      name: (value) => (value.length >= 3 ? null : 'Name must be at least 3 characters long'),
      provider: (value) => (value?.length >= 1 ? null : 'Invalid provider'),
      bucket: (value) => (value?.length >= 1 ? null : 'Invalid bucket'),
      backupSyncPeriod: (value) =>
        value.replace(/\s+/, '') !== '' && ttlRegex.test(value) ? null : 'Invalid format. Expected a number followed by s, m, or h',
      validationFrequency: (value) =>
        value.replace(/\s+/, '') !== '' && ttlRegex.test(value) ? null : 'Invalid format. Expected a number followed by s, m, or h',
      credentialName: (value, values) => {
        if ((value && !values.credentialKey) || (!value && values.credentialKey)) {
          return 'Both Secret Name and Secret Key must be filled or both must be empty';
        }
        return null;
      },
      credentialKey: (value, values) => {
        if ((value && !values.credentialName) || (!value && values.credentialName)) {
          return 'Both Secret Name and Secret Key must be filled or both must be empty';
        }
        return null;
      },
      accessMode: (value) =>
        ['ReadWrite', 'ReadOnly'].includes(value) ? null : 'Access mode must be either "readwrite" or "readonly"',
    },
  });

  function updateBsl(values: any) {
    handleUpdateBsl(values);
    closeAllModals();
    const interval = setInterval(() => {
      setReload((prev: number) => prev + 1);
      clearInterval(interval);
    }, appValues.refreshDatatableAfter);
  }

  return <BslFormView mode="edit" form={form} onDone={updateBsl} />;
}
