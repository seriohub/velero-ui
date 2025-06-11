import { useApiGet } from '@/hooks/utils/useApiGet';

export const useUserInfo = () => {
  const {
    data,
    getData,
    fetching,
    error
  } = useApiGet();

  const getUserInfo = async () => {
    try {

      return await getData({
        url: '/v1/users/me/info',
        target: 'static',
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
    getUserInfo,
    data,
    fetching,
    error,
  };
};
