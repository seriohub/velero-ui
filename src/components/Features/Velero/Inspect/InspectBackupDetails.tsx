'use client';

import { useEffect, useState } from 'react';
import ReactDiffViewer from 'react-diff-viewer-continued';
import { Flex, Paper, ScrollArea } from '@mantine/core';

import { env } from 'next-runtime-env';
import { useInspectFolderContent } from '@/api/Inspect/useInspectBackupContent';

import { useInspectFile } from '@/api/Inspect/useInspectFile';
import Toolbar from '@/components/Display/Toolbar';
import ReloadData from '@/components/Inputs/ReloadData';
import { ExplorerFolder } from '@/components/Features/Velero/Inspect/ExplorerFolder';
import { MainStack } from '@/components/Commons/MainStack';
import { convertJsonToYaml } from '@/utils/jsonToYaml';
import { useK8sManifest } from '@/api/Kubernetes/useK8sManifest';
import { isRecordStringAny } from '@/utils/isRecordStringIsType';

interface BackupProps {
  params: any;
}

export function InspectBackupDetails({ params }: BackupProps) {
  const { data, getInspectFolderContent } = useInspectFolderContent();
  const [reload, setReload] = useState(1);
  const inspectBackupEnabled =
    env('NEXT_PUBLIC_INSPECT_BACKUP_ENABLED')?.toLocaleLowerCase() === 'true';
  const [currentFilePath, setCurrentFilePath] = useState('');
  const [backupTreeData, setBackupTreeData] = useState({});

  const { data: manifestData, getManifest } = useK8sManifest();
  const { data: file, getInspectFile } = useInspectFile();

  const [oldValue, setOldValue] = useState<Record<string, any>>({});
  const [currentValue, setCurrentValue] = useState<Record<string, any>>({});

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
    if (inspectBackupEnabled) {
      if (oldValue?.kind) {
        getManifest(
          file?.kind,
          file?.metadata?.name,
          file?.apiVersion,
          file?.metadata?.namespace === undefined || file?.kind === 'namespaces',
          file?.metadata?.namespace,
          false
        );
      }
    } else {
      setCurrentValue({
        IMPORTANT:
          'To use this feature, you must enable apiConfig.inspectBackupEnabled. Read the notes before proceeding',
      });
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
    <MainStack>
      <Toolbar
        title="Inspect Backups"
        breadcrumbItem={[
          { name: '!!  PROTOTYPE FEATURE  !! Inspect Backup' },
          { name: `📦 Backup ${params?.backup} --- 📄 ${currentFilePath}` },
        ]}
      >
        <ReloadData setReload={setReload} reload={reload} />
      </Toolbar>

      <Paper withBorder h="calc(100% - 68px)" p={0}>
        <Flex h="calc(100%)">
          <ExplorerFolder
            backupName={params.backup}
            content={backupTreeData}
            getInspectFile={getInspectFile}
            setCurrentFile={setCurrentFilePath}
          />

          {oldValue && currentValue && (
            <ScrollArea w="calc(100% - 400px)" offsetScrollbars>
              <ReactDiffViewer
                oldValue={convertJsonToYaml(oldValue)}
                newValue={convertJsonToYaml(currentValue)}
                leftTitle="Backuped data"
                rightTitle="Current kubernetes data"
                splitView
              />
            </ScrollArea>
          )}
        </Flex>
      </Paper>
    </MainStack>
  );
}
