//orginal
import NextAuth from 'next-auth';
import { authConfig } from 'app/auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
//--------------------------------------------------------------
// /middleware.ts
// import { NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt';

// export async function middleware(req: Request) {
//   const token = await getToken({ req });

//   // Sprawdź, czy użytkownik jest zalogowany
//   if (token) {
//     const url = req.url;
    
//     // Przekierowanie do /test jeśli użytkownik zalogowany wchodzi na /protected
//     if (url.includes('/protected')) {
//       return NextResponse.redirect(new URL('/test', req.url));
//     }

//     return NextResponse.next();
//   }

//   // Przekierowanie nieautoryzowanych użytkowników do logowania
//   return NextResponse.redirect(new URL('/login', req.url));
// }

// export const config = {
//   matcher: ['/protected/:path*', '/test/:path*'],
// };
