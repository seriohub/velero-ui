import { useApiPatch } from '@/hooks/utils/useApiPatch';


// Hook per gestire la logica di fetching dei task di categoria
export const useSCUpdateMap = () => {
    const { data, patchData, fetching, error } = useApiPatch()

    const handleScUpdateMap = async (values: any) => {
        try {
            // Esegui la chiamata API con il metodo generico
            await patchData(
                '/v1/sc/change-storage-classes-config-map/update', {
                storageClassMapping: values,
            })

            // Questo codice verrà eseguito solo in caso di successo
            // console.log('Richiesta riuscita, eseguo azioni finali...');
        } catch (error) {
            // Gestione dell'errore
            // console.error('Errore durante la chiamata:', error);
        } finally {
            // Questo codice verrà eseguito sempre
            // console.log('Azione finale dopo la richiesta');
        }
    };

    // Restituisci la funzione per la chiamata e i dati necessari
    return { handleScUpdateMap, responseStatus: data, fetching, error };
};
