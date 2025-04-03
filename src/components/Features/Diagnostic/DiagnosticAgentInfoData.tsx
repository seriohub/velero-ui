'use client';

import {DataTable} from 'mantine-datatable';
import React from 'react';

export const DiagnosticAgentInfoData = ({
                                          uiURL,
                                          apiURL,
                                          apiArch,
                                          origins,
                                          k8sHealth,
                                          stateManager,
                                        }: any) => {
  const elements = [
    {
      label: 'Get UI URL',
      value: uiURL !== undefined ? uiURL : '',
      status: stateManager.getVariable('getUiURL') ? 'ok' : 'error',
    },
    {
      label: 'Get API URL',
      value: apiURL !== undefined ? `${apiURL}/` : '',
      status: stateManager.getVariable('getApiURL') ? 'ok' : 'error',
    },
    {
      label: 'API available',
      value: '',
      status: stateManager.getVariable('checkApiReachable') ? 'ok' : 'error',
    },
    {
      label: 'Get API architecture',
      value: `${apiArch?.arch} ${apiArch?.platform || ''}`,
      status: stateManager.getVariable('getArchitecture') ? 'ok' : 'error',
    },
    {
      label: 'Get Origins',
      value: origins ? origins?.join(', ') : '',
      status: stateManager.getVariable('getOrigins') ? 'ok' : 'error',
    },
    {
      label: 'Validate Origins',
      status: stateManager.getVariable('validateOrigins') ? 'ok' : 'error',
      warning: [origins.length > 0 && origins.includes('*') ? 'Warning: ORIGINS contains "*"' : ''],
      error: [
        origins.length === 0 || (origins.length > 0 && !origins.includes(uiURL))
          ? `Error: Origins must contain ${uiURL}`
          : '',
      ],
      value: [
        !origins.includes('*') && origins.length > 0 && !origins.includes(uiURL)
          ? "If you have problems you can try to use '*'"
          : '',
      ].filter((msg) => msg !== ''),
    },
    {
      label: 'Check Watchdog',
      status: stateManager.getVariable('getWatchdogInfo') ? 'ok' : 'error',
    },
    {
      label: 'Get cluster data',
      status: stateManager.getVariable('getClusterHealth') ? 'ok' : 'error',
      value: [
        `Online: ${k8sHealth?.cluster_online ? 'true' : 'false'}`,
        `Nodes: ${k8sHealth?.nodes?.total}`,
        `Nodes not ready: ${k8sHealth?.nodes?.in_error}`,
      ],
    },
    {
      label: 'UI/API Check Compatibility',
      status: stateManager.getVariable('getUiApiVerCompatibility') ? 'ok' : 'error',
      messages: [
        stateManager.getVariable('getUiApiVerCompatibility')
          ? ''
          : 'UI/API versions not shown in the compatibility list. You can proceed, but errors may occur.',
      ].filter((msg) => msg !== ''),
    },
  ];

  return (
    <>
      <DataTable
        idAccessor='label'
        withTableBorder
        striped
        columns={[
          {
            accessor: 'label',
            title: 'Component',
            width: 250,
          },
          {
            accessor: 'value',
            title: 'Value',
            width: 500,
          },
          {
            accessor: 'status',
            render: ({status}: any) => <>{status?.toString()}</>,
            title: 'Status',
            width: 500,
          },
          {
            accessor: 'warning',
            title: 'Warning',
            render: ({warning}: any) => <>{warning?.join(', ')}</>,
            width: 500,
          },
          {
            accessor: 'error',
            title: 'Error',
            render: ({error}: any) => <>{error?.join(', ')}</>,
            width: 500,
          },
        ]}
        records={elements}
      />
    </>
  );
};
