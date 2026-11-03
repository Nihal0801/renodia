import { Bag } from '@/components/shop';
import { Breadcrumbs } from '@/components/breadcrumbs';
export const metadata = { title: 'Shopping bag' };
export default function Cart() {
  return <div className="wrap simple-page narrow"><Breadcrumbs items={[{ label: 'Shopping bag' }]} />
    <div className="page-heading"><p className="eyebrow">Renodia · Your selection</p><h1>Shopping <em>bag.</em></h1></div><Bag mode="page" /></div>;
}
