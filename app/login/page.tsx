import Link from 'next/link';
import { Form } from 'app/form';
import { signIn } from 'app/auth';
import { SubmitButton } from 'app/submit-button';

export default function Login() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Zaloguj się</h3>
          <p className="text-sm text-gray-500">
            Wprowadź swój adres e-mail i hasło, aby kontynuować.
          </p>
        </div>
        <Form
          action={async (formData: FormData) => {
            'use server';
            await signIn('credentials', {
              redirectTo: '/protected',
              email: formData.get('email') as string,
              password: formData.get('password') as string,
            });
          }}
        >
          <SubmitButton>Zaloguj się</SubmitButton>
          <p className="text-center text-sm text-gray-600">
            {"Nie masz jeszcze konta? "}
            <Link href="/register" className="font-semibold text-gray-800">
              Zarejestruj się
            </Link>
            {' za darmo.'}
          </p>
        </Form>
      </div>
    </div>
  );
}
