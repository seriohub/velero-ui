import { useForm } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';

import { useAppStatus } from '@/contexts/AppContext';

import CreateBslFormView from '@/components/Features/Velero/BackupLocations/Forms/CreateBslFormView';
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
      prefix: '',
      accessMode: 'ReadWrite',

      config: {},

      credentialName: '',
      credentialKey: '',

      backupSyncPeriod: '2m0s',
      validationFrequency: '1m0s',

      default: false,
    },

    validate: {
      name: (value) => (value.length >= 3 ? null : 'Name must be at least 3 characters long'),
      backupSyncPeriod: (value) =>
        ttlRegex.test(value)
          ? null
          : 'Invalid format. Expected a number followed by s, m, or h',
      validationFrequency: (value) =>
        ttlRegex.test(value)
          ? null
          : 'Invalid format. Expected a number followed by s, m, or h',
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

  return <CreateBslFormView mode="create" form={form} onDone={createBsl} />;
}
