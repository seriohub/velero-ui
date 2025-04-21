/*import { useEffect } from 'react';
import { useSocketStatus } from '@/contexts/SocketContext';
import { useAgentStatus } from "@/contexts/AgentContext";

export function useWatchResources(plural: string) {
  const socketValues = useSocketStatus();
  const agentValues = useAgentStatus();

  useEffect(() => {
    const message = {
      action: 'watch',
      plural,
      agent_name: agentValues.currentAgent?.name,
    };

    socketValues.sendMessageToSocket(JSON.stringify(message));
  }, [plural, socketValues]);

  return null;
}*/
// useWatchResources.ts

import { useEffect } from 'react';
import { useSocketStatus } from '@/contexts/SocketContext';
import { useAgentStatus } from "@/contexts/AgentContext";
import { hasWatched, setWatched } from '@/lib/WatchedResources';

export function useWatchResources(plural: string) {
  const socketValues = useSocketStatus();
  const agentValues = useAgentStatus();

  useEffect(() => {
    const agentName = agentValues.currentAgent?.name;

    if (!agentName) return;

    //if (hasWatched(agentName, plural)) return;

    const message =
      {
        type: "watch",
        kind: "command",
        payload: {
          plural,
          agent_name: agentName
        }
      }

    socketValues.sendMessageToSocket(JSON.stringify(message));

    setWatched(agentName, plural);
  }, [plural, agentValues.currentAgent?.name]);
}

