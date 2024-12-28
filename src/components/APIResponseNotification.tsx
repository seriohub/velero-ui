import { notifications } from '@mantine/notifications';
import { IconCheck, IconExclamationMark, IconInfoCircle } from '@tabler/icons-react';

export const showNotification = (
  icon: JSX.Element,
  color: string,
  title: string,
  message: string
) => {
  notifications.show({
    icon,
    color,
    title,
    message,
  });
};

// Definizione del tipo per i parametri della funzione
interface NotificationParams {
  title: string;
  message: string;
  type: string;
  color: string;
  icon: JSX.Element;
}

export const ApiResponseShowErrorNotification = ({
  title,
  message,
}: Omit<NotificationParams, 'type' | 'color' | 'icon'>): void => {
  showNotification(<IconExclamationMark />, 'red', title, message);
};

export const ApiResponseShowInfoNotification = ({
  title,
  message,
}: Omit<NotificationParams, 'type' | 'color' | 'icon'>): void => {
  showNotification(<IconInfoCircle />, 'blue', title, message);
};

export const ApiResponseShowNotification = ({
  title,
  message,
  type,
}: Omit<NotificationParams, 'color' | 'icon'>): void => {
  if (type && type.toLowerCase() === 'info') {
    showNotification(<IconInfoCircle />, 'blue', title, message);
  } else if (type && type.toLowerCase() === 'success') {
    showNotification(<IconCheck />, 'green', title, message);
  } else if (type && type.toLowerCase() === 'warning') {
    showNotification(<IconExclamationMark />, 'orange', title, message);
  } else if (type && type.toLowerCase() === 'error') {
    showNotification(<IconExclamationMark />, 'red', title, message);
  } else {
    showNotification(<IconInfoCircle />, 'blue', title, message);
  }
};
