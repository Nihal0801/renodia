import Image from '@/components/site-image';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Catalogue } from '@/components/catalogue';
import { CollectionCard } from '@/components/editorial';
import { collections, productsFor } from '@/data/catalogue';

type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => collections.map(({ slug }) => ({ slug }));
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: collections.find(item => item.slug === slug)?.name ?? 'Collection' };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const index = collections.findIndex(item => item.slug === slug);
  if (index < 0) notFound();
  const collection = collections[index];
  const related = [1, 2, 3].map(offset => (index + offset) % collections.length);
  return <>
    <section className="collection-hero" style={{ backgroundColor: collection.colour }} data-dark={index === 5}>
      <div className="collection-hero-copy">
        <Breadcrumbs items={[{ label: 'Collections', href: '/#collections' }, { label: collection.name }]} />
        <div><p className="eyebrow">Collection 0{index + 1} / 07</p><h1>{collection.name}</h1><p>{collection.description}</p></div>
      </div>
      <div className="collection-hero-image"><Image src={collection.image} alt="" fill sizes="(max-width: 700px) 100vw, 51vw" preload /></div>
    </section>
    <section className="wrap listing-section" aria-label={collection.name + ' jewellery'}><Catalogue products={productsFor(slug)} byCollection /></section>
    <section className="section wrap related"><div className="section-head"><div><p className="eyebrow">The collection index</p><h2>Explore <em>further.</em></h2></div></div>
      <div className="related-grid">{related.map(i => <CollectionCard key={i} collection={collections[i]} index={i} />)}</div>
    </section>
  </>;
}
