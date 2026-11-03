'use client';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export function Newsletter() {
  const [confirmed, setConfirmed] = useState(false);
  return <form className="newsletter" onSubmit={event => {
    event.preventDefault();
    event.currentTarget.reset();
    setConfirmed(true);
  }}>
    <label className="eyebrow" htmlFor="newsletter-email">Notes from Renodia</label>
    <div><input id="newsletter-email" type="email" placeholder="Your email address" required onChange={() => setConfirmed(false)} />
      <button className="icon" aria-label="Preview newsletter sign-up"><ArrowRight size={17} /></button></div>
    <small aria-live="polite">{confirmed ? 'Demo sign-up complete. Your email was discarded.' : 'Demo sign-up · email stays in this form.'}</small>
  </form>;
}
