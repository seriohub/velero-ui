import { useApiGet } from '@/hooks/utils/useApiGet';

interface GetBackupsProps {
  scheduleName?: string;
  onlyLast4Schedule: boolean;
  forced: boolean;
}

function jsonToQueryParams(json: any) {
  return Object.entries(json)
    .map(([key, value]) => {
      if (value === null || value === undefined) {
        return null;
      }
      // @ts-ignore
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .filter(Boolean)
    .join('&');
}

export const useBackups = () => {
  const {
    data,
    getData,
    fetching,
    fetchedTime,
    error
  } = useApiGet();

  const getBackups = async ({
                              scheduleName,
                              onlyLast4Schedule,
                              forced,
                            }: GetBackupsProps): Promise<void> => {
    try {
      const params = {
        ...(scheduleName && { schedule_name: scheduleName }),
        only_last_for_schedule: onlyLast4Schedule,
        forced,
      };

      return await getData({
        url: '/v1/backups',
        params: jsonToQueryParams(params),
        cache: true,
        force: forced,
      });

    } catch (e) {
      // console.error('Error:', e);
    } finally {
      // This code will always be executed
      // console.log('Final action after request')
    }
  };

  return {
    getBackups,
    data,
    fetching,
    fetchedTime,
    error,
  };
};
