'use client';

import { useSearchParams } from 'next/navigation';
import { Catalogue } from '@/components/catalogue';
import { categories, products } from '@/data/catalogue';

export function JewelleryCatalogue() {
  const category = useSearchParams().get('category');
  const selected = categories.find(item => item === category) ?? '';
  return <Catalogue key={selected} products={products} initialCategory={selected} />;
}
