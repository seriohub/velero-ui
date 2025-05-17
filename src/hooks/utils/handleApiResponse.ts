import {
  ApiResponseShowNotification,
  ApiResponseShowErrorNotification,
} from '@/components/Display/ApiNotification';
import { ApiMessage } from '@/components/Display/ApiMessage';

type HandleApiResponseParams = {
  res: {
    data: any;
    status: number;
    xProcessTime: string | null;
    xFetchedTime: string | null,
  };
  setData: (data: any) => void;
  setFetchedTime: (data: any) => void;
  setError: (value: boolean) => void;
  addNotificationHistory: any;
  addApiResponseHistory: any;
  addInHistory?: boolean;
  backendUrl: string;
  url: string;
  params: string;
  method: string;
};

export const handleApiResponse = ({
                                    res,
                                    setData,
                                    setFetchedTime,
                                    setError,
                                    addNotificationHistory,
                                    addApiResponseHistory,
                                    addInHistory,
                                    backendUrl,
                                    url,
                                    params,
                                    method,
                                  }: HandleApiResponseParams) => {
  const { data } = res;
  const statusCode = res.status;

  if (data && typeof data === 'object' && 'error' in data) {
    setData(undefined);
    setError(true);

    ApiResponseShowErrorNotification({
      title: data.error.title,
      message: data.error.description,
    });
    addNotificationHistory({
      statusCode,
      title: data.error.title,
      description: data.error.description,
    });
  } else if (data && typeof data === 'object' && 'data' in data) {
    setData(data.data);
    setFetchedTime(res.xFetchedTime)
  }

  if (data && typeof data === 'object' && 'notifications' in data) {
    data.notifications.forEach((message: any) => {
      ApiResponseShowNotification({
        title: message.title,
        message: message.description,
        type: message?.info,
      });
      addNotificationHistory({
        statusCode,
        title: message.title,
        description: message.description,
      });
    });
  }

  if (data && typeof data === 'object' && 'messages' in data) {
    data.messages.forEach((message: any) => {
      ApiMessage({
        title: message.title,
        description: message.description,
      });
    });
  }

  if (addInHistory) {
    if (method === 'GET') {
      addApiResponseHistory({
        method,
        url: `${backendUrl}${url}?${params}`,
        data: data?.data,
        statusCode,
        xProcessTime: res.xProcessTime,
        xFetchedTime: res.xFetchedTime,
      });
    } else {
      // console.log("data", data)
      addApiResponseHistory({
        method,
        url: `${backendUrl}${url}`,
        param: params,
        data,
        statusCode,
        xProcessTime: res.xProcessTime,
        xFetchedTime: res.xFetchedTime,
      });
    }
  }
};
