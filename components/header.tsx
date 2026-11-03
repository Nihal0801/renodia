'use client';

import { useCallback, useEffect, useRef, useState, type FocusEvent, type ReactNode } from 'react';
import Link from 'next/link';
import Image from '@/components/site-image';
import { usePathname } from 'next/navigation';
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { collections, productsFor, collectionPath, productPath, money } from '@/data/catalogue';
import { Bag, PanelProvider, SearchResults, Wishlist, useShop, type Panel } from './shop';

const links = [['Jewellery', '/jewellery'], ['The Maison', '/the-maison'], ['Journal', '/journal']];
const featured = collections.map(collection => productsFor(collection.slug));

export function Header({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [panel, setPanel] = useState<Panel | null>(null);
  const pathname = usePathname();
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const suppressFocus = useRef(false);
  const { bag } = useShop();
  const count = Object.values(bag).reduce((total, value) => total + value, 0);

  const cancel = useCallback(() => clearTimeout(timer.current), []);
  const close = useCallback((restore = false) => {
    cancel();
    if (restore) {
      suppressFocus.current = true;
      toggle.current?.focus();
      suppressFocus.current = false;
    }
    setOpen(false);
  }, [cancel]);

  const showPanel = useCallback((next: Panel | null) => {
    close();
    setPanel(next);
  }, [close]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 35);
    const onWheel = (event: WheelEvent) => {
      if (event.target instanceof Element && !event.target.closest('#collections-menu')) close();
    };
    const syncScroll = requestAnimationFrame(() => setScrolled(window.scrollY > 35));
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        event.preventDefault();
        close(true);
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) close();
    };
    const desktop = matchMedia('(min-width: 1025px)');
    const onResize = () => { close(); if (desktop.matches) setPanel(current => current === 'Menu' ? null : current); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    desktop.addEventListener('change', onResize);
    return () => {
      cancelAnimationFrame(syncScroll);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
      desktop.removeEventListener('change', onResize);
    };
  }, [close, open]);

  useEffect(() => () => cancel(), [cancel]);
  useEffect(() => {
    const node = dialog.current;
    if (!panel || !node) return;
    node.showModal();
    if (panel === 'Search') node.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { node.close(); document.body.style.overflow = overflow; };
  }, [panel]);

  const reveal = () => { cancel(); setOpen(true); };
  const deferOpen = (pointer: string) => {
    if (pointer !== 'mouse') return;
    cancel();
    if (!open) timer.current = setTimeout(reveal, 95);
  };
  const deferClose = (pointer: string) => {
    if (pointer !== 'mouse') return;
    cancel();
    timer.current = setTimeout(() => {
      if (!header.current?.querySelector('#collections-menu')?.contains(document.activeElement)) close();
    }, 180);
  };
  const onBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) close();
  };
  const collection = collections[active];

  return <PanelProvider value={showPanel}>
    <a className="skip" href="#main">Skip to content</a>
    <header className={'site-header' + (scrolled ? ' compact' : '') + (open ? ' expanded' : '')} ref={header} onBlur={onBlur} onPointerLeave={event => deferClose(event.pointerType)}>
      <div className="header-inner">
        <button className="icon mobile-trigger" aria-label="Open menu" onClick={() => showPanel('Menu')}><Menu size={22} /></button>
        <nav className="primary" aria-label="Main navigation">
          <button ref={toggle} className="collection-trigger" aria-expanded={open} aria-controls="collections-menu"
            onPointerEnter={event => deferOpen(event.pointerType)}
            onFocus={() => { if (!suppressFocus.current) reveal(); }}
            onKeyDown={event => {
              if (['ArrowDown', 'Enter', ' '].includes(event.key) || (open && event.key === 'Tab' && !event.shiftKey)) {
                event.preventDefault();
                reveal();
                requestAnimationFrame(() => header.current?.querySelector<HTMLAnchorElement>('.collection-nav a')?.focus());
              }
            }}
            onClick={reveal}>Collections <ChevronDown size={12} /></button>
          {links.map(([name, href]) => <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined} onPointerEnter={event => deferClose(event.pointerType)} onFocus={() => close()} onClick={() => close()}>{name}</Link>)}
        </nav>
        <Link className="wordmark" href="/" aria-label="Renodia home" onClick={() => close()}><Image src="/images/renodia-wordmark.webp" width={115} height={64} alt="" loading="eager" /></Link>
        <div className="utilities">
          <button className="icon" aria-label="Search" onClick={() => showPanel('Search')}><Search size={20} /></button>
          <button className="icon header-wish" aria-label="Wishlist" onClick={() => showPanel('Wishlist')}><Heart size={20} /></button>
          <button className="icon bag-trigger" aria-label={'Shopping bag, ' + count + ' items'} onClick={() => showPanel('Shopping bag')}><ShoppingBag size={20} /><span>{count}</span></button>
        </div>
      </div>
      <div id="collections-menu" className="mega" data-open={open} inert={!open}
        onPointerEnter={cancel}
        onKeyDown={event => {
          if (event.key !== 'Tab') return;
          if (event.shiftKey && event.target === event.currentTarget.querySelector('.collection-nav a')) {
            event.preventDefault();
            toggle.current?.focus();
          } else if (!event.shiftKey && event.target === event.currentTarget.querySelector('.mega-view-all')) {
            event.preventDefault();
            header.current?.querySelector<HTMLAnchorElement>('.primary > a')?.focus();
          }
        }}>
        <div className="mega-inner">
          <nav className="collection-nav" aria-label="Collections">
            {collections.map((item, index) => <Link key={item.slug} href={collectionPath(item.slug)}
              data-active={index === active} onPointerEnter={() => setActive(index)}
              onFocus={() => setActive(index)} onClick={() => close()}>{item.name}</Link>)}
          </nav>
          <div className="mega-stack">
            {collections.map((item, index) => <MegaProducts key={item.slug} index={index} active={active === index} close={close} />)}
          </div>
          <Link className="mega-view-all" href={collectionPath(collection.slug)} onClick={() => close()}
            aria-label={'View all ' + collection.name}>View All</Link>
        </div>
      </div>
    </header>
    <div className="mega-shade" data-open={open} aria-hidden="true" onPointerDown={() => close()} />
    {children}
    {panel && <dialog ref={dialog} className="drawer" aria-labelledby="drawer-title" onCancel={event => { event.preventDefault(); showPanel(null); }}
      onKeyDown={event => {
        if (event.key === 'Escape') {
          event.preventDefault();
          showPanel(null);
        }
      }}
      onClick={event => { if (event.target === event.currentTarget) showPanel(null); }}>
      <div className="drawer-shell">
        <div className="drawer-header"><div><p className="eyebrow">Renodia · {panel === 'Menu' ? 'Explore' : 'Studio'}</p><h2 id="drawer-title">{panel}</h2></div><button className="icon" aria-label="Close panel" onClick={() => showPanel(null)}><X size={22} /></button></div>
        <div className="drawer-body">
          {panel === 'Menu' && <nav className="mobile-nav" aria-label="Mobile navigation">
            <details><summary>Collections <ChevronDown size={16} /></summary><div>{collections.map(item => <Link key={item.slug} href={collectionPath(item.slug)} onClick={() => showPanel(null)}>
              <Image src={item.image} width={40} height={40} alt="" />{item.name}<ArrowRight size={14} />
            </Link>)}</div></details>
            {links.map(([name, href]) => <Link key={href} href={href} onClick={() => showPanel(null)}>{name}<ArrowRight size={16} /></Link>)}
            <button onClick={() => showPanel('Wishlist')}>Wishlist <Heart size={17} /></button>
          </nav>}
          {panel === 'Search' && <SearchResults close={() => showPanel(null)} />}
          {panel === 'Shopping bag' && <Bag close={() => showPanel(null)} />}
          {panel === 'Wishlist' && <Wishlist close={() => showPanel(null)} />}
        </div>
      </div>
    </dialog>}
  </PanelProvider>;
}

function MegaProducts({ index, active, close }: { index: number; active: boolean; close: () => void }) {
  const [page, setPage] = useState(0);
  const products = featured[index];
  const lastPage = Math.max(0, products.length - 3);
  return <div className="mega-products" inert={!active} aria-hidden={!active} data-active={active} data-collection={collections[index].slug}>
    <div className="mega-gallery">
      <div className="mega-tiles">
        {products.slice(page, page + 3).map(product => <Link className="mega-tile" key={product.slug} href={productPath(product.slug)} onClick={close}>
          <span className="mega-image"><Image src={product.images[0]} alt="" fill sizes="(min-width: 1025px) 26vw, 32px" /></span>
          <span className="mega-name">{product.name}</span>
          <span className="mega-price">{money(product.price)} <span>Discover ↗</span></span>
        </Link>)}
      </div>
      {lastPage > 0 && <>
        <button className="mega-arrow previous" type="button" aria-label="Previous products" aria-disabled={page === 0}
          onClick={() => setPage(current => Math.max(0, current - 1))}><ChevronLeft size={19} /></button>
        <button className="mega-arrow next" type="button" aria-label="Next products" aria-disabled={page === lastPage}
          onClick={() => setPage(current => Math.min(lastPage, current + 1))}><ChevronRight size={19} /></button>
      </>}
    </div>
    {lastPage > 0 && <div className="mega-pagination" role="group" aria-label="Product preview pages">
      {Array.from({ length: lastPage + 1 }, (_, index) => <button key={index} type="button"
        aria-label={'Show product preview ' + (index + 1)} aria-pressed={page === index} onClick={() => setPage(index)} />)}
    </div>}
  </div>;
}
