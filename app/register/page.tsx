import Link from 'next/link';
import { Form } from 'app/formreg';
import { redirect } from 'next/navigation';
import { createUser, getUser } from 'app/db';
import { SubmitButton } from 'app/submit-button';
import Layout from '@/app/components/Layout';

export default function Register() {
  async function register(formData: FormData) {
    'use server';
    let name = formData.get('name') as string;
    let email = formData.get('email') as string;
    let password = formData.get('password') as string;

    // Walidacja: Sprawdzenie, czy pola są wypełnione
    if (!name || !email || !password) {
      return 'Wszystkie pola muszą być wypełnione.';
    }

    // Walidacja: Sprawdzenie, czy nazwa użytkownika ma co najmniej 3 litery
    if (name.length < 3) {
      return 'Nazwa użytkownika musi zawierać co najmniej 3 litery.';
    }

    // Walidacja: Sprawdzenie, czy hasło ma co najmniej 6 znaków
    if (password.length < 6) {
      return 'Hasło musi mieć co najmniej 6 znaków.';
    }

    // Walidacja formatu e-maila
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Podaj poprawny adres e-mail.';
    }

    let user = await getUser(email);

    if (user) {
      return 'Użytkownik już istnieje'; // TODO: Handle errors with useFormStatus
    } else {
      await createUser(name, email, password);
      redirect('/login');
    }
  }

  return (
    <Layout>
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
          <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
            <h3 className="text-xl font-semibold">Zarejestruj się</h3>
            <p className="text-sm text-gray-500">
              Stwórz konto za pomocą adresu e-mail i hasła.
            </p>
          </div>
          <Form action={register}>
            <SubmitButton>Zarejestruj</SubmitButton>
            <p className="text-center text-sm text-gray-600">
              {'Masz już konto? '}
              <Link href="/login" className="font-semibold text-gray-800">
                Zaloguj się
              </Link>
              {'.'}
            </p>
          </Form>
        </div>
      </div>
    </Layout>
  );
}
