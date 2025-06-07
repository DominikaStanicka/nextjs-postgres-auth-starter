import Layout from '@/app/components/Layout';
import LoginForm from './LoginForm';

export default function Login() {
  return (
    <Layout>
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
          <LoginForm />
        </div>
      </div>
    </Layout>
  );
}
