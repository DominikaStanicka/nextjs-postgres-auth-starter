// app/auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcrypt-ts';
import { getUser } from 'app/db';
import { authConfig } from 'app/auth.config';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize({ email, password }: any) {
        const user = await getUser(email);
        if (!user) throw new Error('Nieprawidłowy email lub hasło');

        const passwordsMatch = await compare(password, user.password!);
        if (!passwordsMatch) throw new Error('Nieprawidłowy email lub hasło');

        return user as any;
      },
    }),
  ],
});
