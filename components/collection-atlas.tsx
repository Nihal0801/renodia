'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { collections, collectionPath } from '@/data/catalogue';

export function CollectionAtlas() {
  const [active, setActive] = useState(() => collections.findIndex(item => item.slug === 'signature-renodia-blue'));
  const collection = collections[active];

  return <div className="atlas">
    <div className="atlas-index" role="group" aria-label="Choose a collection">
      {collections.map((item, index) => <button key={item.slug} type="button"
        aria-pressed={index === active} aria-controls="collection-preview" onClick={() => setActive(index)}>
        <span className="atlas-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <span>{item.name}</span>
        <ArrowUpRight size={16} aria-hidden="true" />
      </button>)}
    </div>
    <div className="atlas-preview" id="collection-preview" style={{ backgroundColor: collection.colour }} data-collection={collection.slug}>
      <div className="atlas-art">
        <Image key={collection.slug} src={collection.image} alt="" fill sizes="(max-width: 750px) 92vw, 65vw" />
      </div>
      <div className="atlas-caption" aria-live="polite">
        <p className="eyebrow">Collection {String(active + 1).padStart(2, '0')} / 07</p>
        <h3>{collection.name}</h3>
        <p>{collection.line}</p>
        <Link className="text-link" href={collectionPath(collection.slug)}>Explore {collection.name} <ArrowUpRight size={15} /></Link>
      </div>
    </div>
  </div>;
}
