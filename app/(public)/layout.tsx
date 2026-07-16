import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function PublicLayout({
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
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
