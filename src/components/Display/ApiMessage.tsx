import { modals } from '@mantine/modals';
import { Code } from '@mantine/core';

interface ApiResponseMessageParams {
  title: string;
  description: string[];
}

export const ApiMessage = ({ title, description }: ApiResponseMessageParams): void => {
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
