import { PageShell } from './page-shell';
import { protocol, rootDomain } from '@/lib/utils';

export function SubdomainView({
  subdomain,
  emoji
}: {
  subdomain: string;
  emoji: string;
}) {
  return (
    <PageShell link={{ href: `${protocol}://${rootDomain}`, label: rootDomain }}>
      <div className="text-center">
        <div className="mb-6 text-9xl">{emoji}</div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Welcome to {subdomain}.{rootDomain}
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          This is your custom subdomain page
        </p>
      </div>
    </PageShell>
  );
}
