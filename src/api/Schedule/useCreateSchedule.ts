import { useApiPost } from '@/hooks/utils/useApiPost';

// Hook per gestire la logica di fetching dei task di categoria
export const useCreateSchedule = () => {
  const { data, postData, fetching, error } = useApiPost();

  const handleCreateSchedule = async (values: any) => {
    try {
      // Esegui la chiamata API con il metodo generico
      await postData('/v1/schedule', values);

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
    handleCreateSchedule,
    responseStatus: data,
    fetching,
    error,
  };
};
