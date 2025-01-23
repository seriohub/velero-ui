import { useApiDelete } from '@/hooks/utils/useApiDelete';

// Hook per gestire la logica di fetching dei task di categoria
export const useSCDelete = () => {
  const { deleteData, fetching, error } = useApiDelete();

  const handleDeleteSCMap = async (params: any) => {
    try {
      // Esegui la chiamata API con il metodo generico
      await deleteData({
        url: '/v1/sc-mapping',
        params: { storageClassMapping: params },
      });

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
    handleDeleteSCMap,
    fetching,
    error,
  };
};
