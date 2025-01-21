//  /app/api/auth/[...nextautch]/route.ts
 export { GET, POST } from 'app/auth';

//------------------------------------------------------------------------------------------------------------------------------------------------
// import { getToken } from "next-auth/jwt";
// import { NextResponse } from "next/server";

// export async function middleware(req: Request) {
//   const secret = process.env.NEXTAUTH_SECRET; // Dodaj tajny klucz
//   const token = await getToken({ req, secret }); // Użyj klucza w funkcji

//   if (token) {
//     return NextResponse.next();
//   }

//   return NextResponse.redirect(new URL("/login", req.url));
// }

// export const config = {
//   matcher: ["/protected/:path*", "/test/:path*"],
// };
