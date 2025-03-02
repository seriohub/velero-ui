'use client';

import { useEffect, useState } from 'react';
import ReactDiffViewer from 'react-diff-viewer-continued';
import { Box, Flex } from '@mantine/core';

import { env } from 'next-runtime-env';
import { useInspectFolderContent } from '@/api/Inspect/useInspectBackupContent';

import { useInspectFile } from '@/api/Inspect/useInspectFile';
import Toolbar from '@/components/Display/Toolbar';
import ReloadData from '@/components/Inputs/ReloadData';
import { ExplorerFolder } from '@/components/Features/Velero/Inspect/ExplorerFolder';
import { MainStack } from '@/components/Commons/MainStack';
import { convertJsonToYaml } from '@/utils/jsonToYaml';
import { useK8sManifest } from '@/api/Kubernetes/useK8sManifest';
import { PageScrollArea } from '@/components/Commons/PageScrollArea';
import { isRecordStringAny } from '@/utils/isRecordStringIsType';

interface BackupProps {
  params: any;
}

export function InspectBackupDetails({ params }: BackupProps) {
  const { data, getInspectFolderContent } = useInspectFolderContent();
  const [reload, setReload] = useState(1);

  const [currentFilePath, setCurrentFilePath] = useState('');
  const [backupTreeData, setBackupTreeData] = useState({});

  const { data: manifestData, getManifest } = useK8sManifest();
  const { data: file, getInspectFile } = useInspectFile();

  const [oldValue, setOldValue] = useState<Record<string, any>>({});
  const [currentValue, setCurrentValue] = useState<Record<string, any>>({});

  const InspectBackupEnabled = env('NEXT_PUBLIC_INSPECT_BACKUP_ENABLED')?.toLowerCase() === 'true';

  useEffect(() => {
    if (params?.backup) {
      getInspectFolderContent(params.backup);
    }
  }, [params]);

  useEffect(() => {
    if (data) {
      setBackupTreeData(data);
    }
  }, [data]);

  useEffect(() => {
    if (oldValue?.kind) {
      if (InspectBackupEnabled) {
        getManifest(
          file?.kind,
          file?.metadata?.name,
          file?.apiVersion,
          file?.metadata?.namespace === undefined || file?.kind === 'namespaces',
          file?.metadata?.namespace,
          false
        );
      } else {
        setCurrentValue({
          IMPORTANT:
            'To use the comparison feature, enable the property apiConfig.inspectBackupEnabled in Helm. Please read the notes beforehand',
        });
      }
    }
  }, [oldValue]);

  useEffect(() => {
    if (isRecordStringAny(file)) {
      setOldValue(file);
    }
  }, [file]);

  useEffect(() => {
    if (isRecordStringAny(manifestData)) {
      setCurrentValue(manifestData);
    }
  }, [manifestData]);

  return (
    <>
      <MainStack bg="red">
        <Toolbar
          title="Inspect Backups"
          breadcrumbItem={[
            { name: '!!  PROTOTYPE FEATURE  !! Inspect Backup' },
            { name: currentFilePath },
          ]}
        >
          <ReloadData setReload={setReload} reload={reload} />
        </Toolbar>
        <PageScrollArea>
          <Flex>
            <Box
              style={{
                position: 'sticky',
                top: '0px',
                alignSelf: 'flex-start',
              }}
              w={400}
              h="100%"
              bg="var(--mantine-color-body)"
            >
              <ExplorerFolder
                backupName={params.backup}
                content={backupTreeData}
                getInspectFile={getInspectFile}
                setCurrentFile={setCurrentFilePath}
              />
            </Box>

            {oldValue && currentValue && (
              <ReactDiffViewer
                oldValue={convertJsonToYaml(oldValue)}
                newValue={convertJsonToYaml(currentValue)}
                leftTitle="Backuped data"
                rightTitle="Current kubernetes data"
                styles={{
                  line: {
                    wordBreak: 'break-all',
                  },
                }}
                splitView
              />
            )}
          </Flex>
        </PageScrollArea>
      </MainStack>
    </>
  );
}
