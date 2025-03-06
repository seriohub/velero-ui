import { useForm } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';

import { useAppStatus } from '@/contexts/AppContext';

import BslFormView from '@/components/Features/Velero/BackupLocations/Forms/BslFormView';
import { useCreateBsl } from '@/api/BackupLocation/useCreateBsl';

interface CreateBslProps {
  reload: number;
  setReload: React.Dispatch<React.SetStateAction<number>>;
}

const ttlRegex = /^(\d+h)?(\d+m)?(\d+s)?$/;

export function CreateBslForm({ reload, setReload }: CreateBslProps) {
  const appValues = useAppStatus();

  const { handleCreateBsl } = useCreateBsl();

  const form = useForm({
    initialValues: {
      name: '',

      provider: '',
      bucket: '',
      prefix: null,
      accessMode: 'ReadWrite',

      config: {},

      credentialName: null,
      credentialKey: null,

      backupSyncPeriod: '2m0s',
      validationFrequency: '1m0s',

      default: false,
    },

    validate: {
      name: (value) => (value.length >= 3 ? null : 'Name must be at least 3 characters long'),
      provider: (value) => (value.length >= 1 ? null : 'Invalid provider'),
      bucket: (value) => (value.length >= 1 ? null : 'Invalid bucket'),
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

  function createBsl(values: any) {
    handleCreateBsl(values);
    closeAllModals();
    const interval = setInterval(() => {
      setReload(reload + 1);
      clearInterval(interval);
    }, appValues.refreshDatatableAfter);
  }

  return <BslFormView mode="create" form={form} onDone={createBsl} />;
}
