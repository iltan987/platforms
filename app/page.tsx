import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { SubdomainForm } from './subdomain-form';
import { getSubdomainData } from '@/lib/subdomains';
import { protocol, rootDomain } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  const subdomain = (await headers()).get('x-subdomain');

  if (!subdomain) {
    return { title: rootDomain };
  }

  const subdomainData = await getSubdomainData(subdomain);
  if (!subdomainData) {
    return { title: rootDomain };
  }

  return {
    title: `${subdomain}.${rootDomain}`,
    description: `Subdomain page for ${subdomain}.${rootDomain}`
  };
}

export default async function Page() {
  const subdomain = (await headers()).get('x-subdomain');

  if (subdomain) {
    const subdomainData = await getSubdomainData(subdomain);
    if (!subdomainData) {
      notFound();
    }

    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="absolute top-4 right-4">
          <Link
            href={`${protocol}://${rootDomain}`}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            {rootDomain}
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-9xl mb-6">{subdomainData.emoji}</div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Welcome to {subdomain}.{rootDomain}
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              This is your custom subdomain page
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4 relative">
      <div className="absolute top-4 right-4">
        <Link
          href="/admin"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Admin
        </Link>
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {rootDomain}
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Create your own subdomain with a custom emoji
          </p>
        </div>

        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <SubdomainForm />
        </div>
      </div>
    </div>
  );
}
