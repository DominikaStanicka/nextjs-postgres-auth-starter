// /app/protected/page.tsx
import { auth, signOut } from 'app/auth';
import Link from 'next/link';
export default async function ProtectedPage() {
  let session = await auth();

  return (
    <div className="flex h-screen bg-black">
      <div className="w-screen h-screen flex flex-col space-y-5 justify-center items-center text-white">
        You are logged in as {session?.user?.email}
        <SignOut />
        <Link href="/test">
          <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md">
            Go to Test Page
          </button>
        </Link>
      </div>
    </div>
  );
}

function SignOut() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
    >
      <button type="submit">Sign out</button>
    </form>
  );
}
//------------------------------------------------------------------------------------------------------------------------------------------------
// /app/protected/page.tsx
// import { redirect } from 'next/navigation';
// import { auth } from 'app/auth';

// export default async function ProtectedPage() {
//   let session = await auth();

//   // Jeśli sesja nie istnieje, przekieruj na stronę logowania
//   if (!session) {
//     redirect('/login');
//   }

//   return null; // Jeśli sesja istnieje, strona jest chroniona
// }
