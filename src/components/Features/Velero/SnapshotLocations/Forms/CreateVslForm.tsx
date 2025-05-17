import { useForm } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';

import { useAppStatus } from '@/contexts/AppContext';

import { useCreateVsl } from '@/api/SnapshotLocation/useCreateVsl';
import VslFormView from '@/components/Features/Velero/SnapshotLocations/Forms/VslFormView';

interface CreateVslProps {
  reload: number;
  setReload: React.Dispatch<React.SetStateAction<number>>;
}

export function CreateVslForm({
                                reload,
                                setReload
                              }: CreateVslProps) {
  const appValues = useAppStatus();

  const { handleCreateVsl } = useCreateVsl();

  const form = useForm({
    initialValues: {
      name: '',
      provider: '',
      config: {},
      credentialName: null,
      credentialKey: null,
    },

    validate: {
      name: (value) => (value.length === 0 ? 'Invalid name' : null),
      provider: (value) => (value.length === 0 ? 'Invalid provider' : null),

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
    },
  });

  function createVsl(values: any) {
    handleCreateVsl(values);
    closeAllModals();
    /*const interval = setInterval(() => {
      setReload(reload + 1);
      clearInterval(interval);
    }, appValues.refreshDatatableAfter);*/
  }

  return <VslFormView mode="create" form={form} onDone={createVsl}/>;
}
