import { PageShell } from './page-shell';
import { SubdomainForm } from './subdomain-form';
import { rootDomain } from '@/lib/utils';

export function RootView() {
  return (
    <PageShell link={{ href: '/admin', label: 'Admin' }}>
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {rootDomain}
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Create your own subdomain with a custom emoji
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <SubdomainForm />
        </div>
      </div>
    </PageShell>
  );
}
