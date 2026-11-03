import { Wishlist } from '@/components/shop';
import { Breadcrumbs } from '@/components/breadcrumbs';
export const metadata = { title: 'Wishlist' };
export default function WishlistPage() {
  return <div className="wrap simple-page narrow"><Breadcrumbs items={[{ label: 'Wishlist' }]} />
    <div className="page-heading"><p className="eyebrow">Renodia · Your selection</p><h1>Wish<em>list.</em></h1></div><Wishlist /></div>;
}
