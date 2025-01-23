import { useApiPut } from '@/hooks/utils/useApiPut';

// Hook per gestire la logica di fetching dei task di categoria
export const useUpdateSchedule = () => {
  const { responseStatus, putData, fetching } = useApiPut();

  const handleUpdateSchedule = async (values: any) => {
    try {
      // Esegui la chiamata API con il metodo generico
      await putData('/v1/schedule', { ...values });

      // This code will be executed only in case of success
      // console.log('Richiesta riuscita, eseguo azioni finali...');
    } catch (e) {
      // Error handling
      // console.error('Error during call:', error);
    } finally {
      // This code will always be executed
      // console.log('Final action after request')
    }
  };

  return {
    handleUpdateSchedule,
    responseStatus,
    fetching,
  };
};
