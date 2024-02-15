import { useState } from 'react';

// Funzione asincrona che verifica la raggiungibilità di un URL
const checkUrlAvailability = async (url) => {
  try {
    const response = await fetch(url);
    // Se il codice di stato della risposta è compreso tra 200 e 299, l'URL è raggiungibile
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    // Se c'è un errore durante la richiesta, l'URL non è raggiungibile
    console.error('Error checkUrlAvailability');
    return false;
  }
};

// Hook personalizzato che gestisce lo stato del risultato del controllo URL
export const useUrlAvailability = (initialUrl) => {
  const [isUrlAvailable, setIsUrlAvailable] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkAvailability = async (url) => {
    setLoading(true);
    const result = await checkUrlAvailability(url);
    setIsUrlAvailable(result);
    setLoading(false);
  };

  return { isUrlAvailable, loading, checkAvailability };
};
