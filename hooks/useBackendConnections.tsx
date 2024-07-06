import { useState, useEffect, useContext } from 'react';
import { useApiGet } from './useApiGet';
import VeleroAppContexts from '@/contexts/VeleroAppContexts';

const useBackendConnection = (interval = 6000) => {
  const appValues = useContext(VeleroAppContexts);
  const [isConnected, setIsConnected] = useState(true);
  const [start, setStart] = useState(false);
  const { data, getData, error } = useApiGet();

  useEffect(() => {
    let intervalId;
    let timeoutId;

    const updateConnectionStatus = async () => {
      //const connectionStatus = await checkBackendConnection();
      getData('/online');
      //setIsConnected(connectionStatus);
    };

    timeoutId = setTimeout(() => {
      updateConnectionStatus();

      // Imposta l'intervallo per verificare periodicamente la connessione
      intervalId = setInterval(updateConnectionStatus, interval);
      setStart(true);
    }, 2000); // 10 secondi per il primo fetch

    // Imposta l'intervallo per verificare periodicamente la connessione
    //intervalId = setInterval(updateConnectionStatus, interval);

    // Pulizia dell'intervallo al momento del dismount del componente
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [interval]);

  useEffect(() => {
    if (start) {
      if (!isConnected && data?.payload) {
        setIsConnected(true);
        appValues.setOnline(true)
      }
      if (isConnected && !data?.payload) {
        setIsConnected(false);
        appValues.setOnline(false)
      }
    }
  }, [data, error]);

  return { isConnected };
};

export default useBackendConnection;
