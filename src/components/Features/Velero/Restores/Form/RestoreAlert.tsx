import { List, Text, Alert, SimpleGrid, Box, Loader, Center } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useStorageClasses } from '@/api/Kubernetes/useStorageClasses';
import { usePvcBackupSC } from '@/api/Restore/usePvcBackupSC';
import { useStorageClassesMap } from '@/api/SCMapping/useStorageClassesMap';
import { useResourceDescribe } from '@/api/Velero/useResourceDescribe';

const getNewStorageClass = (
  storageClass: string,
  veleroMapping: any,
  clusterStorageClasses: any
) => {
  let newStorageClass = veleroMapping?.find(
    (obj: { [x: string]: any }) => obj?.oldStorageClass === storageClass
  )?.newStorageClass;

  if (!newStorageClass && storageClass in veleroMapping) {
    newStorageClass = veleroMapping[storageClass].name;
  }

  if (!newStorageClass && storageClass in clusterStorageClasses) {
    newStorageClass = clusterStorageClasses[storageClass].name;
  }

  return newStorageClass || 'Errore: StorageClass non trovato';
};

interface AlertComponentProps {
  backupName: string;
  visible: boolean;
}

export default function RestoreAlert({ backupName, visible }: AlertComponentProps) {
  const {
    data: clusterStorageClasses,
    getStorageClasses,
    fetching: fetchingStorgaclass,
  } = useStorageClasses();

  const [loader, setLoader] = useState(false);
  const { data: manifest, getResourceDescribe } = useResourceDescribe();

  const { data: pvc, getPvc, fetching: fetchingPvc } = usePvcBackupSC();
  const {
    data: veleroMapping,
    getStorageClassesMap,
    fetching: fetchingVeleroMapping,
  } = useStorageClassesMap();
  useEffect(() => {
    getPvc(backupName); // list of object of pvc data
    getStorageClasses(); // { storage-class : { name: ..., provisioner: ..., parameteres: ...}}
    getStorageClassesMap(); // list of object [{<oldStorageClass>: <newStorageClass>}, ...]
    getResourceDescribe('backup', backupName);
    setLoader(true);
  }, []);

  if (!visible) {
    return <></>;
  }
  if (!loader || fetchingStorgaclass || fetchingVeleroMapping || fetchingPvc) {
    return (
      <Center>
        <Loader />
        Getting data...
      </Center>
    );
  }

  return (
    <Alert
      mb={20}
      variant="light"
      color="blue"
      title="Backup Storage info"
      icon={<IconInfoCircle />}
    >
      <SimpleGrid cols={3}>
        <Box>
          <Text size="sm" fw={800}>
            Included namespace
          </Text>
          <List>
            {manifest !== undefined &&
              manifest?.spec?.includedNamespaces?.map((item: any) => (
                <List.Item key={item}>
                  <Text size="sm">{item}</Text>
                </List.Item>
              ))}
          </List>
        </Box>
        <Box>
          <Text size="sm" fw={800}>
            Cluster storage class
          </Text>
          <List>
            {clusterStorageClasses !== undefined &&
              Object.keys(clusterStorageClasses).map((item: any) => (
                <List.Item key={item}>
                  <Text size="sm">{item}</Text>
                </List.Item>
              ))}
          </List>
        </Box>

        <Box>
          <Text size="sm" fw={800}>
            Velero class storage mapping
          </Text>
          <List>
            {veleroMapping !== undefined &&
              Object.keys(veleroMapping).map((item: any) => (
                <List.Item key={item}>
                  <Text size="sm">
                    {`${veleroMapping[item]?.oldStorageClass} -> ${veleroMapping[item]?.newStorageClass}`}
                  </Text>
                </List.Item>
              ))}
          </List>
        </Box>
      </SimpleGrid>

      <Text size="sm" fw={800}>
        Backup PCV
      </Text>
      <List>
        {pvc !== undefined &&
          Object.keys(pvc).map((item: any) => (
            <List.Item key={item}>
              <Text size="sm">
                {`[${pvc[item]?.name}] ${pvc[item]?.storageClass}] -> ${getNewStorageClass(pvc[item]?.storageClass, veleroMapping, clusterStorageClasses)}`}
              </Text>
            </List.Item>
          ))}
      </List>
    </Alert>
  );
}
