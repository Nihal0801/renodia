'use client';

import { useState } from 'react';
import Image from '@/components/site-image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, Pause, Play } from 'lucide-react';

const words = ['Luxury', 'Grace', 'Brilliance'];
const rings = [
  { name: 'blue', image: '/images/campaign-blue-ring.webp' },
  { name: 'silver', image: '/images/renodia-silver-ring.webp' },
  { name: 'gold', image: '/images/campaign-gold-ring.webp' },
];

export function CampaignHero() {
  const [paused, setPaused] = useState(false);
  return <section className="hero campaign" aria-labelledby="hero-title" data-paused={paused}>
    <div className="campaign-rings" aria-hidden="true">{rings.map(({ name, image }) =>
      <div className={'campaign-ring ring-' + name} key={name}>
        <Image src={image} alt="" fill sizes="(max-width: 650px) 38vw, 26vw" loading="eager" />
      </div>
    )}</div>
    <div className="campaign-copy">
      <p className="eyebrow">The Renodia Collections</p>
      <h1 id="hero-title">
        <span className="sr-only">Renodia signifies luxury, grace and brilliance</span>
        <span className="campaign-title" aria-hidden="true"><span>Renodia Signifies</span>
          <span className="campaign-words">{words.map(word => <span key={word}>{word}</span>)}</span>
        </span>
      </h1>
      <p>Art in every detail.</p>
      <Link href="/#collections" className="button light">Discover the Collections <ArrowRight size={17} /></Link>
    </div>
    <button className="campaign-motion" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Resume hero motion' : 'Pause hero motion'}>
      {paused ? <Play size={16} /> : <Pause size={16} />}
    </button>
    <Link href="/#collections" aria-label="Scroll to collections" className="hero-scroll"><ArrowDown size={19} /></Link>
    <span className="campaign-credit">Renodia · A study in light</span>
  </section>;
}
