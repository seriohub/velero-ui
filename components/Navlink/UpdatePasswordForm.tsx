'use client';

import { useEffect } from 'react';

import { useForm } from '@mantine/form';

import { closeAllModals } from '@mantine/modals';
import { Button, Group, PasswordInput, Space } from '@mantine/core';
import { PasswordStrength } from '@/components/Auth/PasswordStrength';
import { useApiPut } from '@/hooks/useApiPut';

export function UpdatePasswordForm() {
  const { putData, responseStatus } = useApiPut();

  const form = useForm({
    initialValues: {
      // password: '',
      newPassword: '',
      confirmPassword: '',
    },

    validate: {
      // password: (value) => (value.length === 0 ? 'Invalid password' : null),
      newPassword: (value) => (value.length === 0 ? 'Invalid new password' : null),
      confirmPassword: (value, values) =>
        value !== values.newPassword ? 'Passwords did not match' : null,
    },
  });

  function onDone(password: string) {
    putData('/v1/users/me/update/pwd', { password });
  }

  useEffect(() => {
    if (responseStatus === 200) {
      closeAllModals();
    }
  }, [responseStatus]);

  return (
    <>
      <form
        onSubmit={form.onSubmit(() => {
          onDone(form.values.newPassword);
        })}
      >
        {/*<PasswordInput
          placeholder="Your password"
          id="password"
          label="Password"
          required
          {...form.getInputProps('password')}
          />
        */}
        <Space h="lg" />
        <PasswordStrength {...form.getInputProps('newPassword')} />
        <Space h="xs" />
        <PasswordInput
          placeholder="Confirm password"
          id="confirm-password"
          label="Confirm Password"
          required
          {...form.getInputProps('confirmPassword')}
        />
        <Space h="md" />
        <Group justify="flex-end" mt="md">
          <Button onClick={() => closeAllModals()}>Close</Button>
          <Button type="submit" color="green">
            Update
          </Button>
        </Group>
      </form>
    </>
  );
}
