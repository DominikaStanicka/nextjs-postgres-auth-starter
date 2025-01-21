import Link from "next/link";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <header className="flex justify-between items-center p-4 bg-pink-400 text-white">
          <div className="text-2xl font-bold">Polecajka.pl</div>
          <nav className="flex space-x-4">
            <Link href="/" className="hover:underline">
              Produkty
            </Link>
            <Link href="/account" className="hover:underline">
              Konto
            </Link>
          </nav>
        </header>
        <main className="flex-grow p-6">{children}</main>
        <footer className="bg-pink-400 text-white text-center p-4 mt-4">
          &copy; 2025 Polecajka.pl. Wszystkie prawa zastrzeżone.
        </footer>
      </body>
    </html>
  );
}
