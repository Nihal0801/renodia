import Image from '@/components/site-image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { articles, categories, collections, collectionPath, type Collection } from '@/data/catalogue';
import { Newsletter } from './newsletter';

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="text-link">{children} <ArrowRight size={15} /></Link>;
}

export function CollectionCard({ collection, index }: { collection: Collection; index: number }) {
  return <Link href={collectionPath(collection.slug)} className="collection-card">
    <div className="editorial-image" style={{ background: collection.colour }}><Image src={collection.image} fill sizes="(max-width: 650px) 80vw, 33vw" alt="" /><span>0{index + 1}</span></div>
    <div className="collection-card-caption"><div><h3>{collection.name}</h3><p>{collection.line}</p></div><ArrowRight size={19} /></div>
  </Link>;
}

export function Signature() {
  const collection = collections[5];
  return <section className="signature">
    <div className="signature-image"><Image src={collection.image} alt="Blue ring on folds of midnight satin" fill sizes="(max-width: 700px) 100vw, 59vw" /></div>
    <div className="signature-copy"><p className="eyebrow">Collection 06 · The colour studies</p><h2>Into the depths<br /><em>of blue.</em></h2><p>{collection.description}</p><TextLink href={collectionPath(collection.slug)}>Signature Renodia Blue</TextLink></div>
  </section>;
}

export function MaisonFeature() {
  return <section className="maison-feature">
    <div className="maison-photo"><Image src="/images/maison.webp" fill sizes="(max-width: 700px) 100vw, 48vw" alt="Jewellery arranged on limestone in warm sunlight" /></div>
    <div className="maison-copy"><p className="eyebrow">The Maison</p><h2>A closer <em>look.</em></h2><p>At Renodia, jewellery begins with the way a detail makes you feel. Colour can be quiet or bold. A familiar shape can take on a different character in the light.</p><TextLink href="/the-maison">The world of Renodia</TextLink></div>
  </section>;
}

export function JournalCards() {
  return <div className="journal-grid">{articles.map(article => <Link className="journal-card" key={article.slug} href={'/journal/' + article.slug}>
    <div className="editorial-image"><Image src={article.image} fill sizes="(max-width: 700px) 100vw, 46vw" alt="" /></div>
    <p className="eyebrow">{article.label}</p><h3>{article.title} <ArrowRight size={18} /></h3>
  </Link>)}</div>;
}

export function Footer() {
  return <footer className="footer">
    <div className="footer-top">
      <div><Link href="/" className="footer-wordmark" aria-label="Renodia home"><Image src="/images/renodia-wordmark.webp" width={135} height={76} alt="" /></Link><p>Jewellery in colour and light.</p><Newsletter /></div>
      <div className="footer-links"><p className="eyebrow">Collections</p>{collections.map(collection => <Link key={collection.slug} href={collectionPath(collection.slug)}>{collection.name}</Link>)}</div>
      <div className="footer-links"><p className="eyebrow">The studio</p><Link href="/the-maison">About Renodia</Link><Link href="/journal">Journal</Link><Link href="/help/contact">Contact</Link><Link href="/help/guide">Help</Link><Link href="/wishlist">Wishlist</Link></div>
      <div className="footer-links"><p className="eyebrow">Discover</p>{categories.map(category => <Link key={category} href={'/jewellery?category=' + category}>{category}</Link>)}</div>
    </div>
    <div className="footer-bottom"><span>© Renodia · Demonstration storefront</span><div><Link href="/help/privacy">Demo privacy</Link><Link href="/help/terms">Demo terms</Link></div><span>India · INR</span></div>
  </footer>;
}
