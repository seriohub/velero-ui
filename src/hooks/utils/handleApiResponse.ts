import {
  ApiResponseShowNotification,
  ApiResponseShowErrorNotification,
} from '@/components/APIResponseNotification';
import { APIResponseMessage } from '@/components/APIResponseMessage';

type HandleApiResponseParams = {
  res: {
    data: any;
    status: number;
    xProcessTime: string | null;
  };
  setData: (data: any) => void;
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

  if ('error' in data) {
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
  } else if ('data' in data) {
    setData(data.data);
  }

  if ('notifications' in data) {
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

  if ('messages' in data) {
    data.messages.forEach((message: any) => {
      APIResponseMessage({
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
        data,
        statusCode,
        xProcessTime: res.xProcessTime,
      });
    } else {
      addApiResponseHistory({
        method,
        url: `${backendUrl}${url}`,
        param: params,
        data,
        statusCode,
        xProcessTime: res.xProcessTime,
      });
    }
  }
};
