import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/breadcrumbs';
const pages = {
  contact: ['Contact', 'This storefront is a demonstration. Customer service channels can be added when Renodia provides verified contact details.'],
  guide: ['Help', 'Browse by collection or jewellery type, save pieces to your wishlist, and use your bag to preview a selection. Your wishlist and bag are saved in this browser.'],
  privacy: ['Demo privacy', 'Your wishlist and bag are stored locally in this browser. The newsletter form discards the submitted email. Clear this site’s browser data to remove your saved selections.'],
  terms: ['Demo terms', 'The catalogue contains illustrative designs and prices. Checkout is an order summary preview. Commercial policies will be needed for a live store.'],
};
export const generateStaticParams = () => Object.keys(pages).map(slug => ({ slug }));
export default async function Help({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!Object.hasOwn(pages, slug)) notFound();
  const [title, copy] = pages[slug as keyof typeof pages];
  return <div className="wrap simple-page narrow"><Breadcrumbs items={[{ label: title }]} /><div className="page-heading"><p className="eyebrow">Renodia · Store information</p><h1>{title}</h1><p>{copy}</p></div></div>;
}
