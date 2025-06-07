import Layout from '@/app/components/Layout';
import RegisterForm from './RegisterForm';
import { createUser, getUser } from 'app/db';
import { redirect } from 'next/navigation';

// Funkcja serwerowa do obsługi rejestracji
export async function register(prevState: any, formData: FormData) {
  'use server';
  let name = formData.get('name') as string;
  let email = formData.get('email') as string;
  let password = formData.get('password') as string;

  if (!name || !email || !password) {
    return 'Wszystkie pola muszą być wypełnione.';
  }
  if (name.length < 3) {
    return 'Nazwa użytkownika musi zawierać co najmniej 3 litery.';
  }
  if (password.length < 6) {
    return 'Hasło musi mieć co najmniej 6 znaków.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Podaj poprawny adres e-mail.';
  }
  let user = await getUser(email);
  if (user) {
    return 'Użytkownik już istnieje';
  } else {
    await createUser(name, email, password);
    redirect('/login');
  }
}

export default function Register() {
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
          <RegisterForm register={register} />
        </div>
      </div>
    </Layout>
  );
}