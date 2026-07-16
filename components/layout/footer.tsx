import Link from "next/link";
import { Container } from "./container";

const FOOTER_LINKS = {
  platform: [
    { href: "/wydarzenia", label: "Wydarzenia" },
    { href: "/vod", label: "VOD" },
    { href: "/warsztaty", label: "Warsztaty" },
    { href: "/poprzednie-edycje", label: "Poprzednie edycje" },
  ],
  info: [
    { href: "/o-nas", label: "O nas" },
    { href: "/faq", label: "FAQ" },
    { href: "/kontakt", label: "Kontakt" },
    { href: "/dostepnosc", label: "Dostępność" },
  ],
  legal: [
    { href: "/regulamin-wydarzen", label: "Regulamin wydarzeń" },
    { href: "/regulamin-vod", label: "Regulamin VOD" },
    { href: "/regulamin-warsztatow", label: "Regulamin warsztatów" },
    { href: "/polityka-prywatnosci", label: "Polityka prywatności" },
    { href: "/polityka-cookies", label: "Polityka cookies" },
  ],
} as const;

function Footer() {
  return (
    <footer className="border-t border-border bg-background-secondary">
      <Container>
        <div className="grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              href="/"
              className="font-heading text-lg font-bold text-text-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-gold"
            >
              Moc Płomienia
            </Link>
            <p className="mt-3 text-sm text-text-muted">
              Wydarzenia, nagrania VOD i warsztaty dla kobiet.
            </p>
          </div>

          <FooterLinkGroup title="Platforma" links={FOOTER_LINKS.platform} />
          <FooterLinkGroup title="Informacje" links={FOOTER_LINKS.info} />
          <FooterLinkGroup title="Regulaminy" links={FOOTER_LINKS.legal} />
        </div>

        <div className="border-t border-border py-6 text-center text-sm text-text-muted">
          &copy; {new Date().getFullYear()} Moc Płomienia. Wszelkie prawa
          zastrzeżone.
        </div>
      </Container>
    </footer>
  );
}

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ href: string; label: string }>;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-text-dark">{title}</h3>
      <ul className="mt-3 flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-text-muted transition-colors hover:text-text-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-gold"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { Footer };
