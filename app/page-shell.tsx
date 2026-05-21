import Link from 'next/link';

export function PageShell({
  link,
  children
}: {
  link: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-white p-4">
      <Link
        href={link.href}
        className="absolute top-4 right-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        {link.label}
      </Link>
      <div className="flex flex-1 items-center justify-center">{children}</div>
    </div>
  );
}
