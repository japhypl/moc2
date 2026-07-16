"use client";

import { useState } from "react";
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Container } from "./container";

const NAV_LINKS = [
  { href: "/wydarzenia", label: "Wydarzenia" },
  { href: "/vod", label: "VOD" },
  { href: "/warsztaty", label: "Warsztaty" },
  { href: "/poprzednie-edycje", label: "Poprzednie edycje" },
  { href: "/o-nas", label: "O nas" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background-primary/95 backdrop-blur-sm">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="font-heading text-xl font-bold text-text-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-gold"
          >
            Moc Płomienia
          </Link>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Nawigacja główna">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text-muted transition-colors hover:text-text-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-button text-text-dark hover:bg-background-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-gold md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Otwórz menu"
          >
            <HamburgerIcon />
          </button>
        </div>
      </Container>

      <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <DialogContent className="top-0 left-0 h-full max-w-full translate-x-0 translate-y-0 rounded-none border-0 sm:max-w-sm">
          <DialogTitle className="sr-only">Menu nawigacyjne</DialogTitle>
          <nav className="mt-8 flex flex-col gap-1" aria-label="Menu mobilne">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-button px-4 py-3 text-lg font-medium text-text-dark transition-colors hover:bg-background-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </DialogContent>
      </Dialog>
    </header>
  );
}

function HamburgerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6h16M4 12h16M4 18h16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export { Header };
