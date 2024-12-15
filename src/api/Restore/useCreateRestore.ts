import { useApiPost } from '@/hooks/utils/useApiPost';

// Hook per gestire la logica di fetching dei task di categoria
export const useCreateRestore = () => {
    const { data, postData, fetching, error } = useApiPost()

    const handleCreateRestore = async (resourceName: string, resourceType: string, mappingNamespace: any, parameters: string) => {
        try {
            // Esegui la chiamata API con il metodo generico
            await postData(
                '/v1/restore/create', {
                resource_name: resourceName,
                resource_type: resourceType,
                mapping_namespaces: mappingNamespace,
                parameters: parameters,
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
    return { handleCreateRestore, responseStatus: data, fetching, error };
};
