import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";

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
            </nav>
          </div>
        </Container>
      </header>
      <main>
        <Container className="py-8">{children}</Container>
      </main>
    </>
  );
}
