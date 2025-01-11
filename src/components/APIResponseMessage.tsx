import { modals } from '@mantine/modals';
import { Code } from '@mantine/core';

// Definizione del tipo per i parametri della funzione
interface ApiResponseMessageParams {
  title: string;
  description: string[];
}

export const APIResponseMessage = ({ title, description }: ApiResponseMessageParams): void => {
  modals.open({
    title,
    size: 'lg',
    children: (
      <Code block color="#010101">
        {description.join('\n')}
      </Code>
    ),
  });
};
