import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getSubdomainData } from '@/lib/subdomains';
import { rootDomain } from '@/lib/utils';
import { RootView } from './root-view';
import { SubdomainView } from './subdomain-view';

async function getSubdomain() {
  return (await headers()).get('x-subdomain');
}

export async function generateMetadata(): Promise<Metadata> {
  const subdomain = await getSubdomain();
  if (!subdomain) return { title: rootDomain };

  const data = await getSubdomainData(subdomain);
  if (!data) return { title: rootDomain };

  return {
    title: `${subdomain}.${rootDomain}`,
    description: `Subdomain page for ${subdomain}.${rootDomain}`
  };
}

export default async function Page() {
  const subdomain = await getSubdomain();
  if (!subdomain) return <RootView />;

  const data = await getSubdomainData(subdomain);
  if (!data) notFound();

  return <SubdomainView subdomain={subdomain} emoji={data.emoji} />;
}
