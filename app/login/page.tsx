// //app/login/page.tsx
import Link from 'next/link';
import { Form } from 'app/form'; // Twój komponent formularza
import { signIn } from 'app/auth'; // Funkcja do logowania użytkownika
import { SubmitButton } from 'app/submit-button'; // Przycisk wysyłający formularz
import Layout from '@/app/components/Layout'; // Layout komponent

export default function Login() {
  return (
    <Layout>
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
          <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
            <h3 className="text-xl font-semibold">Zaloguj się</h3>
            <p className="text-sm text-gray-500">
              Wprowadź swój adres e-mail i hasło, aby kontynuować.
            </p>
          </div>
          <Form
            action={async (formData: FormData) => {// na froncie  mam tyły 
              'use server'; // Mówi, że ta funkcja działa na serwerze

              // Przekazanie danych logowania do funkcji signIn
              await signIn('credentials', {
                redirectTo: '/account', // Po zalogowaniu przekierowanie na stronę chronioną
                email: formData.get('email') as string,  // Pobranie adresu e-mail z formularza
                password: formData.get('password') as string,  // Pobranie hasła z formularza
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
    </Layout>
  );
}
