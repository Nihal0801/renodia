'use client';
import { useEffect, useRef, useState } from 'react';
import Image from '@/components/site-image';
import { SlidersHorizontal, X, ZoomIn } from 'lucide-react';
import { categories, collections, money, type Product } from '@/data/catalogue';
import { ProductCard } from './shop';

export function Catalogue({ products, initialCategory = '', byCollection = false }: { products: Product[]; initialCategory?: string; byCollection?: boolean }) {
  const [category, setCategory] = useState(initialCategory);
  const [collection, setCollection] = useState('');
  const [price, setPrice] = useState('');
  const [order, setOrder] = useState('featured');
  const filter = useRef<HTMLDialogElement>(null);
  const listed = products.filter(product => (!category || product.category === category) && (!collection || product.collectionSlug === collection) && (!price || product.price <= Number(price)));
  if (order === 'low') listed.sort((a, b) => a.price - b.price);
  if (order === 'high') listed.sort((a, b) => b.price - a.price);
  if (order === 'name') listed.sort((a, b) => a.name.localeCompare(b.name));
  const selected = [
    { label: category, clear: () => setCategory('') },
    { label: collections.find(item => item.slug === collection)?.name, clear: () => setCollection('') },
    { label: price && 'Up to ' + money(Number(price)), clear: () => setPrice('') },
  ].filter(item => item.label);
  const reset = () => { setCategory(''); setCollection(''); setPrice(''); };
  const filters = () => <>
    <label>Type<select value={category} onChange={event => setCategory(event.target.value)}><option value="">All types</option>{categories.map(item => <option key={item}>{item}</option>)}</select></label>
    {!byCollection && <label>Collection<select value={collection} onChange={event => setCollection(event.target.value)}><option value="">All collections</option>{collections.map(item => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label>}
    <label>Price<select value={price} onChange={event => setPrice(event.target.value)}><option value="">Any price</option>{[20000, 30000, 50000].map(value => <option key={value} value={value}>Up to {money(value)}</option>)}</select></label>
  </>;
  useEffect(() => {
    const dialog = filter.current;
    if (!dialog) return;
    const desktop = matchMedia('(min-width: 701px)');
    const change = () => { if (desktop.matches && dialog.open) dialog.close(); };
    desktop.addEventListener('change', change);
    return () => desktop.removeEventListener('change', change);
  }, []);
  return <div className="catalogue">
    <div className="filter-bar">
      <div className="desktop-filters">{filters()}</div>
      <button className="mobile-filters button" onClick={() => filter.current?.showModal()}><SlidersHorizontal size={16} /> Filters{selected.length > 0 && <span className="filter-badge">{selected.length}</span>}</button>
      <label className="sort">Sort by<select value={order} onChange={event => setOrder(event.target.value)}>
        <option value="featured">Featured</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option><option value="name">Name</option>
      </select></label>
    </div>
    <dialog ref={filter} className="drawer" aria-label="Catalogue filters" onClick={event => { if (event.target === event.currentTarget) filter.current?.close(); }}>
      <div className="drawer-shell"><div className="drawer-header"><h2>Filters</h2><button className="icon" aria-label="Close filters" onClick={() => filter.current?.close()}><X size={21} /></button></div>
      <div className="drawer-body filter-content">{filters()}<button className="button dark" onClick={() => filter.current?.close()}>Show {listed.length} {listed.length === 1 ? 'piece' : 'pieces'}</button><button className="text-link" onClick={reset}>Clear filters</button></div></div>
    </dialog>
    {selected.length > 0 && <div className="selected-filters" role="group" aria-label="Active filters">
      {selected.map(({ label, clear }) => <button className="filter-chip" key={label} onClick={clear}
        aria-label={'Remove filter: ' + label}>{label}<X size={13} aria-hidden="true" /></button>)}
      {selected.length > 1 && <button className="text-link" onClick={reset}>Clear filters</button>}
    </div>}
    <p className="result-count" aria-live="polite">{listed.length} {listed.length === 1 ? 'piece' : 'pieces'} <span>· Demo catalogue</span></p>
    {listed.length ? <div className="product-grid">{listed.map(product => <ProductCard product={product} key={product.slug} />)}</div> :
      <div className="empty"><p>There are no pieces in this selection.</p><button className="text-link" onClick={reset}>Clear filters</button></div>}
  </div>;
}

export function Gallery({ product }: { product: Product }) {
  const [index, setIndex] = useState(0);
  const zoom = useRef<HTMLDialogElement>(null);
  return <div className="gallery">
    <div className="gallery-thumbs" aria-label="Product views">{product.images.map((image, position) =>
      <button key={image} aria-label={position === 0 ? 'Full product view' : 'Product detail crop'} aria-pressed={position === index} onClick={() => setIndex(position)}><Image src={image} width={74} height={74} alt="" /></button>
    )}</div>
    <button className="gallery-main" aria-label="Zoom product image" onKeyDown={event => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        setIndex(current => (current + (event.key === 'ArrowRight' ? 1 : product.images.length - 1)) % product.images.length);
      }} onClick={() => zoom.current?.showModal()}>
      <Image src={product.images[index]} alt={product.name + (index ? ', detail crop' : '')} fill sizes="(max-width: 750px) 100vw, 55vw" preload={index === 0} />
      <span className="icon"><ZoomIn size={21} /></span>
    </button>
    <dialog className="zoom" aria-label={'Enlarged image of ' + product.name} ref={zoom} onClick={event => { if (event.target === event.currentTarget) zoom.current?.close(); }}>
      <button className="icon" aria-label="Close zoom" onClick={() => zoom.current?.close()}><X size={23} /></button>
      <Image src={product.images[index]} width={780} height={780} alt={product.name} />
    </dialog>
  </div>;
}
