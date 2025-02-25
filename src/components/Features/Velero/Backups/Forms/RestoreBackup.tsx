'use client';

import { useEffect, useState } from 'react';

import {
  Button,
  Card,
  Divider,
  Group,
  List,
  Space,
  Text,
  TextInput,
  ThemeIcon,
  rem,
} from '@mantine/core';
import { closeAllModals } from '@mantine/modals';

import { useForm } from '@mantine/form';

import { IconCheck, IconInfoCircle, IconX, IconArrowRight } from '@tabler/icons-react';
import { useResourceDescribe } from '@/api/Velero/useResourceDescribe';
import { useStorageClasses } from '@/api/Kubernetes/useStorageClasses';
import { usePvcBackupSC } from '@/api/Restore/usePvcBackupSC';
import { useStorageClassesMap } from '@/api/SCMapping/useStorageClassesMap';
import { useCreateRestore } from '@/api/Restore/useCreateRestore';

interface RestoreBackupProps {
  backupName: string;
  reload: number;
  setReload: any;
}

interface MappingNamespace {
  [key: string]: any; // Or specify the type of values if known
}

function getFormattedTimestamp() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Mesi da 0 a 11, quindi aggiungiamo 1
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

export function RestoreBackup({ backupName, reload, setReload }: RestoreBackupProps) {
  const { handleCreateRestore } = useCreateRestore();

  const { data: dataRestore, getResourceDescribe } = useResourceDescribe();
  const { data: storageClasses, getStorageClasses } = useStorageClasses();
  const { data: pvc, getPvc } = usePvcBackupSC();
  const { data: configMap, getStorageClassesMap } = useStorageClassesMap();

  const [storageClassesList, setStoragesClassesList] = useState<React.ReactNode[]>([]);
  const [configMapList, setConfigMapList] = useState<React.ReactNode[]>([]);
  const [mappingNamespaceList, setMappingNamespaceList] = useState<React.ReactNode[]>([]);
  const [pvcList, setPvcList] = useState<React.ReactNode[]>([]);

  const [mapNamespace, setMapNamespace] = useState<MappingNamespace>({});

  const form = useForm({
    initialValues: {
      mappingNamespace: {},
      parameters: '',
    },
  });

  function restore_backup() {
    handleCreateRestore(
      backupName,
      `${backupName.toLocaleLowerCase()}-${getFormattedTimestamp()}`,
      form.values.mappingNamespace,
      form.values.parameters
    );
    setReload(reload + 1);
  }

  function onDone(values: any) {
    restore_backup();
    closeAllModals();
  }

  function updateMappingNamespace(item: string, e: any) {
    if (e.currentTarget.value !== '') {
      const tmp = mapNamespace;
      tmp[item] = e.currentTarget.value;
      setMapNamespace(tmp);
    } else {
      const tmp = mapNamespace;
      delete tmp[item];
      setMapNamespace(tmp);
    }
  }

  useEffect(() => {
    form.values.mappingNamespace = mapNamespace;
  }, [mapNamespace]);

  // load data
  useEffect(() => {
    getResourceDescribe('backup', backupName); // object
    getPvc(backupName); // list of object of pvc data
    getStorageClasses(); // { storage-class : { name: ..., provisioner: ..., parameteres: ...}}
    getStorageClassesMap(); // list of object [{<oldStorageClass>: <newStorageClass>}, ...]
  }, []);

  useEffect(() => {
    if (dataRestore?.spec?.includedNamespaces != null) {
      const values = dataRestore.spec.includedNamespaces.map((item: string) => (
        <>
          <TextInput
            key={item}
            label={`Namespace ${item}`}
            placeholder={`Optional: new name for the namespace ${item}`}
            // value={parameters}
            onChange={(e) => updateMappingNamespace(item, e)}
          />
        </>
      ));
      setMappingNamespaceList(values);
    }
  }, [dataRestore]);

  useEffect(() => {
    if (storageClasses !== undefined) {
      const values = Object.keys(storageClasses).map((item: any) => (
        <List.Item key={item}>
          <Text size="sm">{`${item}`}</Text>
        </List.Item>
      ));
      setStoragesClassesList(values);
    }
  }, [storageClasses]);

  useEffect(() => {
    if (configMap !== undefined) {
      const values = configMap?.map((item: any) => (
        <List.Item key={item['oldStorageClass']}>
          <Text size="sm">
            {`${item['oldStorageClass']}`} : {`${item['newStorageClass']}`}
          </Text>
        </List.Item>
      ));
      setConfigMapList(values);
    }
  }, [configMap]);

  useEffect(() => {
    if (pvc !== undefined) {
      const values = pvc.map((item: any) => (
        <>
          <Group gap={5}>
            <Text size="sm">PVC name:</Text>
            <Text size="sm" fw={800}>
              {item['metadata']['name']}
            </Text>
            <Space w={20} />
            <Text size="sm">Backup storage class:</Text>
            {storageClasses !== undefined &&
              item['spec']['storageClassName'] !== 'manual' &&
              Object.keys(storageClasses).includes(item['spec']['storageClassName']) && (
                <>
                  <IconCheck color="green" />
                </>
              )}
            {storageClasses !== undefined &&
              item['spec']['storageClassName'] !== 'manual' &&
              !Object.keys(storageClasses).includes(item['spec']['storageClassName']) && (
                <>
                  <IconX color="red" />
                </>
              )}
            <Text size="sm" fw={800}>
              {item['spec']['storageClassName']}
            </Text>
            <Space w={20} />
            {configMap !== undefined &&
              configMap?.some(
                (obj: { [x: string]: any }) =>
                  obj['oldStorageClass'] === item['spec']['storageClassName']
              ) && (
                <>
                  <Text size="sm">New storage class: </Text>
                  <Text size="sm" fw={800}>
                    {
                      configMap?.find(
                        (obj: { [x: string]: any }) =>
                          obj['oldStorageClass'] === item['spec']['storageClassName']
                      )['newStorageClass']
                    }
                  </Text>
                </>
              )}
          </Group>
        </>
      ));
      setPvcList(values);
    }
  }, [pvc, storageClasses, configMap]);

  useEffect(() => {
    if (configMap !== undefined && pvc !== undefined) {
      const cm: any[] = [];
      configMap?.map((item: any) =>
        cm.push({
          oldStorageClass: item['oldStorageClass'],
          newStorageClass: item['newStorageClass'],
        })
      );
      const sc: any[] = [];
      pvc.map((item: any) => {
        if (
          storageClasses !== undefined &&
          item['spec']['storageClassName'] !== 'manual' &&
          !cm.some((obj: { [x: string]: any }) => obj['oldStorageClass'] === item)
        ) {
          sc.push({
            oldStorageClass: item['spec']['storageClassName'],
            newStorageClass: Object.keys(storageClasses).includes(item['spec']['storageClassName'])
              ? item['spec']['storageClassName']
              : '',
          });
        }
      });
      // setNewStorageClassesMap(cm.concat(sc));
    }
  }, [storageClasses, configMap, pvcList]);

  return (
    <>
      <form
        onSubmit={form.onSubmit((values: any) => {
          onDone(values);
        })}
      >
        <Text>Confirm restore backup {backupName}?</Text>
        <Space h="xs" />
        <Divider h={20} />
        <Card withBorder radius="md" p="sm">
          <Group gap={5}>
            <IconInfoCircle
              style={{
                width: rem(24),
                height: rem(24),
              }}
            />
            <Text size="sm" fw={800}>
              Cluster storage classes:
            </Text>
          </Group>
          <List
            icon={
              <ThemeIcon color="green" size={18} radius="xl">
                <IconCheck
                  style={{
                    width: rem(12),
                    height: rem(12),
                  }}
                />
              </ThemeIcon>
            }
            withPadding
          >
            {storageClassesList}
          </List>
          <Space h="xl" />
          <Group gap={5}>
            <IconInfoCircle
              style={{
                width: rem(24),
                height: rem(24),
              }}
            />
            <Text size="sm" fw={800}>
              Velero Config Map:
            </Text>
          </Group>
          <Text pl={20} size="sm">
            {'<'}oldStorageClass{'>'}: {'<'}newStorageClass{'>'}
          </Text>
          <List
            icon={
              <ThemeIcon color="green" size={18} radius="xl">
                <IconArrowRight
                  style={{
                    width: rem(12),
                    height: rem(12),
                  }}
                />
              </ThemeIcon>
            }
            withPadding
          >
            {configMapList}
          </List>
        </Card>
        <Divider />
        <Space h="xl" />
        <Text>Mapping namespace</Text>
        {mappingNamespaceList}

        <Space h="xl" />
        <Text>Backup PVC List</Text>
        {pvcList}
        <Space h="xl" />

        <TextInput
          label="Additional parameters"
          placeholder="Optional"
          {...form.getInputProps('parameters')}
        />

        <Group mt="md" gap="sm" justify="flex-end">
          <Button color="green" type="submit">
            Restore
          </Button>
          <Button variant="transparent" c="dimmed" onClick={() => closeAllModals()}>
            Close
          </Button>
        </Group>
      </form>
      <Space h="xl" />
    </>
  );
}
