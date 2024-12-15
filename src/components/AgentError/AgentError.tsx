import { Alert } from '@mantine/core';

import { IconInfoCircle } from '@tabler/icons-react';

import { useAgentStatus } from '@/contexts/AgentStatusContext';

export const AgentError = () => {
  const agentValues = useAgentStatus();
  const icon = <IconInfoCircle />;

  return (
    <>
      {agentValues.isAgentAvailable==false && (
        <Alert variant="light" color="pink" title="Error" icon={icon}>
          {agentValues.currentAgent?.name} agent disconnected
        </Alert>
      )}
      {agentValues.isAgentAvailable==undefined && (
        <Alert variant="light" color="blue" title="Check..." icon={icon}>
          Check if {agentValues.currentAgent?.name} agent is available...
        </Alert>
      )}
    </>
  );
};
