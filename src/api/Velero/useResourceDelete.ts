import { useApiDelete } from '@/hooks/utils/useApiDelete';

// Hook per gestire la logica di fetching dei task di categoria
export const useResourceDelete = () => {
  const { deleteData, fetching, error } = useApiDelete();

  const handleDeleteResource = async (resourceType: string, params: any) => {
    try {
      // Esegui la chiamata API con il metodo generico
      await deleteData({
        url: `/v1/${resourceType}`,
        params,
      });

      // Questo codice verrà eseguito solo in caso di successo
      // console.log('Richiesta riuscita, eseguo azioni finali...');
    } catch (e) {
      // Gestione dell'errore
      // console.error('Error:', error);
    } finally {
      // Questo codice verrà eseguito sempre
      // console.log('Azione finale dopo la richiesta');
    }
  };

  // Restituisci la funzione per la chiamata e i dati necessari
  return {
    handleDeleteResource,
    fetching,
    error,
  };
};
