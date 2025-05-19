'use client';

import { useState, useEffect } from 'react';
import { Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

import { useAgentStatus } from '@/contexts/AgentContext';

export default function AgentError() {
  const agentValues = useAgentStatus();
  const icon = <IconInfoCircle/>;
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<'error' | 'check' | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (agentValues.isAgentAvailable === false) {
        setAlertType('error');
        setShowAlert(true);
      } else if (agentValues.isAgentAvailable === undefined) {
        setAlertType('check');
        setShowAlert(true);
      } else {
        setShowAlert(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [agentValues.isAgentAvailable]);

  return (
    <>
      {showAlert && alertType === 'error' && (
        <Alert variant="light" color="pink" title="Error" icon={icon}>
          {agentValues.currentAgent?.name} agent disconnected
        </Alert>
      )}
      {showAlert && alertType === 'check' && (
        <Alert variant="light" color="blue" title="Check..." icon={icon}>
          Check if {agentValues.currentAgent?.name} agent is available...
        </Alert>
      )}
    </>
  );
}
