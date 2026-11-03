'use client';

import { createContext, useContext, useSyncExternalStore, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Minus, Plus, ArrowRight, Search, X } from 'lucide-react';
import { collections, products, collectionPath, productBySlug, productPath, money, type Product } from '@/data/catalogue';

type Shop = { bag: Record<string, number>; saved: string[] };
export type Panel = 'Search' | 'Wishlist' | 'Shopping bag' | 'Menu';
const initial: Shop = { bag: {}, saved: [] };
let cachedRaw: string | null | undefined;
let cached = initial;
const listeners = new Set<() => void>();
const storageKey = 'renodia-shop-v1';

function snapshot() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      const value = raw ? JSON.parse(raw) : initial;
      cached = value?.bag && Array.isArray(value.saved) ? value : initial;
    }
  } catch { /* Keep the in-memory store available when storage is disabled. */ }
  return cached;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) listener();
  };
  window.addEventListener('storage', onStorage);
  return () => { listeners.delete(listener); window.removeEventListener('storage', onStorage); };
}

function update(transform: (state: Shop) => Shop) {
  cached = transform(snapshot());
  try {
    const raw = JSON.stringify(cached);
    localStorage.setItem(storageKey, raw);
    cachedRaw = raw;
  } catch { /* The current session can continue using the in-memory store. */ }
  listeners.forEach(listener => listener());
}

const PanelContext = createContext<(panel: Panel | null) => void>(() => {});
export const PanelProvider = PanelContext.Provider;
export const usePanel = () => useContext(PanelContext);
export const useShop = () => useSyncExternalStore(subscribe, snapshot, () => initial);
export function setQuantity(slug: string, quantity: number) {
  update(state => {
    const bag = { ...state.bag };
    if (quantity < 1) delete bag[slug];
    else bag[slug] = Math.min(99, quantity);
    return { ...state, bag };
  });
}

export function WishlistButton({ product }: { product: Product }) {
  const selected = useShop().saved.includes(product.slug);
  return <button type="button" className="icon wish" aria-label={(selected ? 'Remove ' : 'Save ') + product.name + (selected ? ' from wishlist' : ' to wishlist')} aria-pressed={selected}
    onClick={() => update(state => ({ ...state, saved: state.saved.includes(product.slug) ? state.saved.filter(slug => slug !== product.slug) : [...state.saved, product.slug] }))}>
    <Heart size={19} fill={selected ? 'currentColor' : 'none'} />
  </button>;
}

export function Quantity({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return <div className="quantity">
    <button type="button" className="icon" aria-label="Decrease quantity" disabled={value <= 1} onClick={() => onChange(value - 1)}><Minus size={15} /></button>
    <output aria-label="Quantity">{value}</output>
    <button type="button" className="icon" aria-label="Increase quantity" disabled={value >= 99} onClick={() => onChange(value + 1)}><Plus size={15} /></button>
  </div>;
}

export function AddToBag({ product }: { product: Product }) {
  const [quantity, change] = useState(1);
  const showPanel = usePanel();
  return <div className="purchase">
    <Quantity value={quantity} onChange={change} />
    <button className="button dark" onClick={() => {
      update(state => ({ ...state, bag: { ...state.bag, [product.slug]: Math.min(99, (state.bag[product.slug] ?? 0) + quantity) } }));
      showPanel('Shopping bag');
    }}>Add to Bag <ArrowRight size={16} /></button>
    <WishlistButton product={product} />
  </div>;
}

export function ProductCard({ product }: { product: Product }) {
  return <article className="product-card">
    <Link className="product-photo" href={productPath(product.slug)} aria-label={product.name}>
      <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 650px) 50vw, (max-width: 1000px) 33vw, 25vw" />
    </Link>
    <WishlistButton product={product} />
    <div className="product-caption"><small>{product.category}</small><Link href={productPath(product.slug)}>{product.name}</Link><span>{money(product.price)}</span></div>
  </article>;
}

export function Bag({ mode = 'drawer', close }: { mode?: 'drawer' | 'page' | 'checkout'; close?: () => void }) {
  const { bag } = useShop();
  const lines = Object.entries(bag).flatMap(([slug, quantity]) => {
    const product = productBySlug(slug);
    return product ? [{ product, quantity }] : [];
  });
  const subtotal = lines.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
  if (!lines.length) return <div className="empty"><p>Your shopping bag is empty.</p><Link className="button dark" href="/jewellery" onClick={close}>Discover jewellery <ArrowRight size={16} /></Link></div>;
  return <div className="bag-content">
    {lines.map(({ product, quantity }) => <article className="bag-line" key={product.slug}>
      <Link href={productPath(product.slug)} onClick={close}><Image src={product.images[0]} alt={product.name} width={90} height={90} /></Link>
      <div><Link className="line-title" href={productPath(product.slug)} onClick={close}>{product.name}</Link><p>{money(product.price)}{mode === 'checkout' && ' × ' + quantity}</p>
        {mode !== 'checkout' && <div className="line-controls"><Quantity value={quantity} onChange={value => setQuantity(product.slug, value)} />
          <button className="text-link" onClick={() => setQuantity(product.slug, 0)}>Remove</button></div>}
      </div>
    </article>)}
    <div className="subtotal"><span>Subtotal</span><output data-testid="subtotal">{money(subtotal)}</output></div>
    {mode === 'drawer' && <><Link className="button dark" href="/cart" onClick={close}>View Bag <ArrowRight size={16} /></Link><button className="text-link continue" onClick={close}>Continue Shopping</button></>}
    {mode === 'page' && <Link className="button dark" href="/checkout">Preview Checkout <ArrowRight size={16} /></Link>}
  </div>;
}

export function Wishlist({ close }: { close?: () => void }) {
  const { saved } = useShop();
  const list = products.filter(product => saved.includes(product.slug));
  if (!list.length) return <div className="empty"><p>Save the pieces you want to come back to.</p><Link className="button dark" href="/jewellery" onClick={close}>Explore jewellery <ArrowRight size={16} /></Link></div>;
  return <div className="saved-list">{list.map(product => <article className="bag-line" key={product.slug}>
    <Link href={productPath(product.slug)} onClick={close}><Image src={product.images[0]} width={90} height={90} alt={product.name} /></Link>
    <div><Link href={productPath(product.slug)} className="line-title" onClick={close}>{product.name}</Link><p>{money(product.price)}</p><WishlistButton product={product} /></div>
  </article>)}</div>;
}

export function SearchResults({ close }: { close: () => void }) {
  const [input, setInput] = useState('');
  const query = input.trim().toLowerCase();
  const suggested = collections.filter(collection => collection.name.toLowerCase().includes(query));
  const results = query ? products.filter(product => [product.name, product.category, collections.find(c => c.slug === product.collectionSlug)?.name].join(' ').toLowerCase().includes(query)) : [];
  return <div className="search-content">
    <label className="search-field"><Search size={19} /><input autoFocus type="search" placeholder="Search the catalogue" aria-label="Search the catalogue" value={input} onChange={event => setInput(event.target.value)} />
      {input && <button className="icon" aria-label="Clear search" onClick={() => setInput('')}><X size={15} /></button>}
    </label>
    <div aria-live="polite">
      {suggested.length > 0 && <div className="search-collections"><p className="eyebrow">{query ? 'Matching collections' : 'Discover collections'}</p>{suggested.map(collection => <Link key={collection.slug} href={collectionPath(collection.slug)} onClick={close}>{collection.name} <ArrowRight size={13} /></Link>)}</div>}
      {results.map(product => <Link className="search-result" key={product.slug} href={productPath(product.slug)} onClick={close}><Image src={product.images[0]} alt="" width={58} height={58} /><span>{product.name}</span><span>{money(product.price)}</span></Link>)}
      {query && !results.length && !suggested.length && <p className="empty">No results for “{input.trim()}”. Try a collection name or jewellery type.</p>}
    </div>
  </div>;
}
