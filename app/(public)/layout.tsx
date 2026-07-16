export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* TODO: Public header/navigation */}
      <main>{children}</main>
      {/* TODO: Public footer */}
    </>
  );
}
