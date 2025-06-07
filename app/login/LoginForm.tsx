'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react'; // Importuj stąd, a nie 'app/auth'!
import { Form } from 'app/form';
import { SubmitButton } from 'app/submit-button';

export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setErrorMessage(null);

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // signIn z next-auth/react z redirect: false by złapać błąd
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setErrorMessage('Nieprawidłowy email lub hasło');
    } else {
      // Przekieruj ręcznie
      window.location.href = '/account';
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
        <h3 className="text-xl font-semibold">Zaloguj się</h3>
        <p className="text-sm text-gray-500">
          Wprowadź swój adres e-mail i hasło, aby kontynuować.
        </p>
      </div>
      <Form action={onSubmit}>
        <SubmitButton>Zaloguj się</SubmitButton>
      </Form>
      {errorMessage && (
        <p className="mt-2 text-center text-red-600">{errorMessage}</p>
      )}
      <p className="text-center text-sm text-gray-600">
        {"Nie masz jeszcze konta? "}
        <Link href="/register" className="font-semibold text-gray-800">
          Zarejestruj się
        </Link>
        {' za darmo.'}
      </p>
    </>
  );
}
