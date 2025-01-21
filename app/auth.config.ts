// /app/auth.config.ts
import { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      let isLoggedIn = !!auth?.user;
      let isOnDashboard = nextUrl.pathname.startsWith('/protected');
      let isOnTestpage = nextUrl.pathname.startsWith('/account');


      if (isOnDashboard) {
        return isLoggedIn;
      }

      if (isOnTestpage) {
        return isLoggedIn;
      }

      // Redirect logged-in users trying to access the login page to `/account`
      if (nextUrl.pathname === '/login' && isLoggedIn) {
        return Response.redirect(new URL('/account', nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
//------------------------------------------------------------------------------------------------------------------------------------------------
// /app/auth.config.ts
// import { NextAuthConfig } from 'next-auth';

// export const authConfig = {
//   pages: {
//     signIn: '/login',
//   },
//   secret: process.env.AUTH_SECRET ,  // Dodanie domyślnego klucza, jeśli brak w .env
//   providers: [
//     // Twoi dostawcy
//   ],
//   callbacks: {
//     async authorized({ auth, request: { nextUrl } }) {
//       const isLoggedIn = !!auth?.user;
//       const isOnDashboard = nextUrl.pathname.startsWith('/protected');

//       if (isOnDashboard) {
//         if (isLoggedIn) return true;
//         return false;  // Przekierowanie niezalogowanych użytkowników
//       } else if (isLoggedIn) {
//         return Response.redirect(new URL('/protected', nextUrl));  // Przekierowanie do /protected
//       }

//       return true;
//     },
//   },
// } satisfies NextAuthConfig;

