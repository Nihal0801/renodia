import { Suspense } from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { JewelleryCatalogue } from '@/components/jewellery-catalogue';
export const metadata = { title: 'Jewellery' };

export default function Jewellery() {
  return <div className="wrap simple-page">
    <Breadcrumbs items={[{ label: 'Jewellery' }]} />
    <div className="page-heading"><p className="eyebrow">The complete edit</p><h1>Jewellery<em>.</em></h1><p>Explore the forms and colours of Renodia.</p></div>
    <Suspense fallback={<p role="status">Loading jewellery…</p>}><JewelleryCatalogue /></Suspense>
  </div>;
}
