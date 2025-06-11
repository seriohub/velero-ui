import { useApiGet } from '@/hooks/utils/useApiGet';

export const useK8sManifest = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getManifest = async (
    kind: string,
    name: string,
    api_version: string,
    is_cluster_resource: boolean = false,
    namespace: string | undefined = undefined,
    neat: boolean = false
  ) => {
    try {

      return await getData({
        url: '/v1/k8s/manifest',
        params: `kind=${kind}&name=${name}&api_version=${api_version}${namespace ? `&namespace=${namespace}` : ''}&is_cluster_resource=${is_cluster_resource}&neat=${neat}`,
      });

    } catch (e) {
      // Error handling
      // console.error('Error during call:', error);
    } finally {
      // This code will always be executed
    }
  };

  // Return the function for the call and the necessary data

  return {
    getManifest,
    data,
    fetching,
    error,
  };
};
