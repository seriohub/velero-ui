import { useState } from 'react';
import { useServerStatus } from '@/contexts/ServerContext';

// Asynchronous function that checks the reachability of a URL
const checkUrlAvailability = async (url: string) => {
  try {
    const response = await fetch(url);
    // If the response status code is between 200 and 299, the URL is reachable
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    // If there is an error during the request, the URL is unreachable
    console.error('Error checkUrlAvailability');
    return false;
  }
};

// Custom hook that handles the state of the result of the URL check
export const useUrlAvailability = () => {
  const [isUrlAvailable, setIsUrlAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const serverValues = useServerStatus();

  const checkAvailability = async (url: string) => {
    if (serverValues.isServerAvailable === true) {
      setLoading(true);
      const result = await checkUrlAvailability(url);
      setIsUrlAvailable(result);
      setLoading(false);
    }
  };

  return {
    isUrlAvailable,
    loading,
    checkAvailability,
  };
};
