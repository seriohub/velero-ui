'use client';

import { useEffect, useState } from 'react';

import {
  Button,
  Card,
  Divider,
  Group,
  List,
  Select,
  Space,
  Text,
  TextInput,
  ThemeIcon,
  rem,
} from '@mantine/core';
import { closeAllModals } from '@mantine/modals';

import { useForm } from '@mantine/form';
import { useApiPost } from '@/hooks/useApiPost';
import { useApiGet } from '@/hooks/useApiGet';
import { IconCheck, IconInfoCircle, IconX } from '@tabler/icons-react';
import { IconArrowRight } from '@tabler/icons-react';

interface RestoreBackupProps {
  resourceType: string;
  resourceName: string;
  reload: number;
  setReload: any;
}

interface MappingNamespace {
  [key: string]: any; // Or specify the type of values if known
}

export function RestoreBackup({
  resourceType,
  resourceName,
  reload,
  setReload,
}: RestoreBackupProps) {
  const { postData } = useApiPost();

  const { data: dataRestore, getData: getDataRestore } = useApiGet();
  const { data: storageClasses, getData: getStorageClasses } = useApiGet();
  const { data: pvc, getData: getPvc } = useApiGet();
  const { data: configMap, getData: getConfigMap } = useApiGet();

  // ui dynamic react node
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
    postData('/v1/restore/create', {
      resource_name: `${resourceName}`,
      resource_type: `${resourceType}`,
      mapping_namespaces: form.values.mappingNamespace,
      parameters: form.values.parameters,
    });
    setReload(reload + 1);
  }

  function onDone(values: any) {
    restore_backup();
    closeAllModals();
  }

  function updateMappingNamespace(item: string, e: any) {
    if (e.currentTarget.value !== '') {
      let tmp = mapNamespace;
      tmp[item] = e.currentTarget.value;
      setMapNamespace(tmp);
    } else {
      let tmp = mapNamespace;
      delete tmp[item];
      setMapNamespace(tmp);
    }
  }

  useEffect(() => {
    form.values.mappingNamespace = mapNamespace;
  }, [mapNamespace]);

  // load data
  useEffect(() => {
    getDataRestore({ url: `/v1/${resourceType}/describe`, param: `resource_name=${resourceName}` }); // object
    getPvc({ url: '/v1/backup/get-storage-classes', param: `backup_name=${resourceName}` }); // list of object of pvc data
    getStorageClasses({ url: '/v1/k8s/sc/get' }); // { storage-class : { name: ..., provisioner: ..., parameteres: ...}}
    getConfigMap({ url: '/v1/sc/change-storage-classes-config-map/get' }); // list of object [{<oldStorageClass>: <newStorageClass>}, ...]
  }, []);

  useEffect(() => {
    if (
      //dataRestore !== undefined &&
      //dataRestore['payload']['status']['resourceList']['v1/Namespace'] !== null
      dataRestore?.payload?.status?.resourceList?.['v1/Namespace'] != null
    ) {
      const values = dataRestore['payload']['status']['resourceList']['v1/Namespace'].map(
        (item: string) => (
          <>
            <TextInput
              key={item}
              label={`Namespace ${item}`}
              placeholder={`Optional: new name for the namespace ${item}`}
              // value={parameters}
              onChange={(e) => updateMappingNamespace(item, e)}
            />
          </>
        )
      );
      setMappingNamespaceList(values);
    }
  }, [dataRestore]);

  useEffect(() => {
    if (storageClasses !== undefined) {
      const values = Object.keys(storageClasses.payload).map((item: any) => (
        <List.Item key={item}>
          <Text size="sm">{`${item}`}</Text>
        </List.Item>
      ));
      setStoragesClassesList(values);
    }
  }, [storageClasses]);

  useEffect(() => {
    if (configMap?.payload !== undefined) {
      const values = configMap?.payload.map((item: any) => (
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
      const values = pvc.payload.map((item: any) => (
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
              Object.keys(storageClasses.payload).includes(item['spec']['storageClassName']) && (
                <>
                  <IconCheck color="green" />
                </>
              )}
            {storageClasses !== undefined &&
              item['spec']['storageClassName'] !== 'manual' &&
              !Object.keys(storageClasses.payload).includes(item['spec']['storageClassName']) && (
                <>
                  <IconX color="red" />
                </>
              )}
            <Text size="sm" fw={800}>
              {item['spec']['storageClassName']}
            </Text>
            <Space w={20} />
            {configMap?.payload !== undefined &&
              configMap?.payload.some(
                (obj: { [x: string]: any }) =>
                  obj['oldStorageClass'] == item['spec']['storageClassName']
              ) && (
                <>
                  <Text size="sm">New storage class: </Text>
                  <Text size="sm" fw={800}>
                    {
                      configMap?.payload.find(
                        (obj: { [x: string]: any }) =>
                          obj['oldStorageClass'] == item['spec']['storageClassName']
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
    if (configMap?.payload !== undefined && pvc !== undefined) {
      const cm: any[] = [];
      configMap?.payload.map((item: any) =>
        cm.push({
          oldStorageClass: item['oldStorageClass'],
          newStorageClass: item['newStorageClass'],
        })
      );
      const sc: any[] = [];
      pvc.payload.map((item: any) => {
        if (
          storageClasses !== undefined &&
          item['spec']['storageClassName'] !== 'manual' &&
          !cm.some((obj: { [x: string]: any }) => obj['oldStorageClass'] == item)
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
        <Text>
          Confirm restore backup {resourceName} from {resourceType}?
        </Text>
        <Space h="xs" />
        <Divider h={20} />
        <Card withBorder radius="md" p="sm">
          <Group gap={5}>
            <IconInfoCircle style={{ width: rem(24), height: rem(24) }} />
            <Text size="sm" fw={800}>
              Cluster storage classes:
            </Text>
          </Group>
          <List
            icon={
              <ThemeIcon color="green" size={18} radius="xl">
                <IconCheck style={{ width: rem(12), height: rem(12) }} />
              </ThemeIcon>
            }
            withPadding
          >
            {storageClassesList}
          </List>
          <Space h="xl" />
          <Group gap={5}>
            <IconInfoCircle style={{ width: rem(24), height: rem(24) }} />
            <Text size="sm" fw={800}>
              Velero Config Map:
            </Text>
          </Group>
          <Text pl={20} size="sm">
            {`<`}oldStorageClass{`>`}: {`<`}newStorageClass{`>`}
          </Text>
          <List
            icon={
              <ThemeIcon color="green" size={18} radius="xl">
                <IconArrowRight style={{ width: rem(12), height: rem(12) }} />
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
