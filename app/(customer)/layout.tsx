import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { CustomerNav } from "@/components/customer-nav";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only fixed left-4 top-4 z-50 rounded-button bg-accent-gold px-4 py-2 text-sm font-medium text-text-light focus:outline-2 focus:outline-offset-2 focus:outline-accent-gold"
      >
        Przejdź do treści
      </a>
      <header className="border-b border-border bg-background-primary">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="font-heading text-xl font-bold text-text-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-gold"
            >
              Moc Płomienia
            </Link>
            <nav className="flex items-center gap-4 text-sm" aria-label="Konto">
              <Link
                href="/konto"
                className="text-text-muted hover:text-text-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-gold"
              >
                Moje konto
              </Link>
              <Link
                href="/wylogowanie"
                className="text-text-muted hover:text-text-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-gold"
              >
                Wyloguj
              </Link>
            </nav>
          </div>
        </Container>
      </header>
      <Container>
        <CustomerNav />
      </Container>
      <main id="main-content">
        <Container className="py-8">{children}</Container>
      </main>
    </>
  );
}
