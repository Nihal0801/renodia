import Image from '@/components/site-image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { JournalCards, MaisonFeature, Signature, TextLink } from '@/components/editorial';
import { CollectionAtlas } from '@/components/collection-atlas';
import { CampaignHero } from '@/components/campaign-hero';
import { ProductCard } from '@/components/shop';
import { categories, collections, products, collectionPath } from '@/data/catalogue';

export default function Home() {
  const selected = [products[0], products[5], products[18], products[23]];
  return <>
    <CampaignHero />
    <section id="collections" className="section wrap">
      <div className="section-head"><div><p className="eyebrow">01 / The collection index</p><h2>Distinct by <em>design.</em></h2></div><p>Seven collections, each with its own palette and point of view.</p></div>
      <CollectionAtlas />
    </section>
    <Signature />
    <section className="section wrap">
      <div className="section-head"><div><p className="eyebrow">02 / The jewellery edit</p><h2>Selected <em>pieces.</em></h2></div><TextLink href="/jewellery">View all jewellery</TextLink></div>
      <div className="product-grid">{selected.map(product => <ProductCard key={product.slug} product={product} />)}</div>
      <p className="demo-note">Illustrative designs and demo prices.</p>
    </section>
    <section className="category-section"><div className="wrap">
      <div className="section-head"><div><p className="eyebrow">03 / Find your form</p><h2>By <em>silhouette.</em></h2></div></div>
      <div className="category-grid">{[...categories, 'High Jewellery'].map((category, index) => <Link key={category}
        href={index === 4 ? collectionPath(collections[6].slug) : '/jewellery?category=' + category}>
        <div className="editorial-image"><Image src={index === 4 ? collections[6].image : products[index].images[0]} fill sizes="(max-width: 650px) 42vw, 20vw" alt="" /></div><span>{category}<ArrowRight size={14} /></span>
      </Link>)}</div>
    </div></section>
    <MaisonFeature />
    <section className="section wrap">
      <div className="section-head"><div><p className="eyebrow">04 / The journal</p><h2>In the <em>details.</em></h2></div><TextLink href="/journal">Read the journal</TextLink></div>
      <JournalCards />
    </section>
  </>;
}
