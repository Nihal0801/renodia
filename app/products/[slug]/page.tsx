import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Gallery } from '@/components/catalogue';
import { AddToBag, ProductCard } from '@/components/shop';
import { collections, products, productsFor, productBySlug, collectionPath, money } from '@/data/catalogue';

type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => products.map(({ slug }) => ({ slug }));
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: productBySlug(slug)?.name ?? 'Jewellery' };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) notFound();
  const collection = collections.find(item => item.slug === product.collectionSlug)!;
  return <div className="wrap product-page">
    <Breadcrumbs items={[{ label: collection.name, href: collectionPath(collection.slug) }, { label: product.name }]} />
    <section className="product-detail">
      <Gallery key={slug} product={product} />
      <div className="product-info">
        <Link className="eyebrow" href={collectionPath(collection.slug)}>{collection.name}</Link>
        <h1>{product.name}</h1><p className="product-price">{money(product.price)} <span>Demo price</span></p>
        <p className="product-description">{product.description}</p><AddToBag key={slug} product={product} />
        <details className="product-details"><summary>About this piece</summary><p>{product.category} · {collection.name}. This is an illustrative design in the Renodia demonstration catalogue.</p></details>
      </div>
    </section>
    <section className="section related"><div className="section-head"><div><p className="eyebrow">The {collection.name} edit</p><h2>In good <em>company.</em></h2></div></div>
      <div className="product-grid">{productsFor(collection.slug).filter(item => item.slug !== slug).map(item => <ProductCard product={item} key={item.slug} />)}</div>
    </section>
  </div>;
}
