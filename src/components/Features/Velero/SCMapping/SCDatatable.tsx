'use client';

import { useEffect, useState } from 'react';

import { useStorageClassesMap } from '@/api/SCMapping/useStorageClassesMap';
import { useAgentStatus } from '@/contexts/AgentContext';

import { MainStack } from '@/components/Commons/MainStack';
import Toolbar from '@/components/Display/Toolbar';
import { DataFetchedInfo } from '@/components/Display/DataFetchedInfo';
import CreateSCMappingIcon from '@/components/Features/Velero/SCMapping/CreateSCMappingIcon';
import { SCMMRT } from '@/components/Features/Velero/SCMapping/SCMMRT';

export function SCDatatable() {
  const {
    data: configMap,
    getStorageClassesMap,
    fetching
  } = useStorageClassesMap();
  const [items, setItems] = useState<any>([]);
  const [reload, setReload] = useState(1);
  const agentValues = useAgentStatus();

  useEffect(() => {
    if (agentValues.isAgentAvailable && reload > 1) {
      getStorageClassesMap(true);
    }
  }, [reload]);

  useEffect(() => {
    getStorageClassesMap();
  }, []);

  useEffect(() => {
    if (configMap !== undefined) {
      setItems(configMap);
    }
  }, [configMap]);

  return (
    <MainStack>
      <Toolbar title="Storage Class Mapping" breadcrumbItem={[{ name: 'Storage Class Mapping' }]}>
        <></>
      </Toolbar>
      <DataFetchedInfo metadata={configMap?.metadata}/>
      <SCMMRT
        fetching={fetching}
        setReload={setReload}
        items={items}
        customActions={
          <>
            <CreateSCMappingIcon setReload={setReload} reload={reload}/>
          </>
        }
      />
    </MainStack>
  );
}
