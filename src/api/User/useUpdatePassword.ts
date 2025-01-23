import { useApiPut } from '@/hooks/utils/useApiPut';

// Hook per gestire la logica di fetching dei task di categoria
export const useUpdatePassword = () => {
  const { putData, responseStatus, fetching } = useApiPut({ target: 'static' });

  const handleUpdatePassword = async (password: string) => {
    try {
      // Esegui la chiamata API con il metodo generico
      await putData('/v1/users/me/update/pwd', { password });

      // Questo codice verrà eseguito solo in caso di successo
      // console.log('Richiesta riuscita, eseguo azioni finali...');
    } catch (e) {
      // Gestione dell'errore
      // console.error('Errore durante la chiamata:', error);
    } finally {
      // Questo codice verrà eseguito sempre
      // console.log('Azione finale dopo la richiesta');
    }
  };

  // Restituisci la funzione per la chiamata e i dati necessari
  return {
    handleUpdatePassword,
    responseStatus,
    fetching,
  };
};
