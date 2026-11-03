import { Bag } from '@/components/shop';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { TextLink } from '@/components/editorial';
export const metadata = { title: 'Demo checkout' };
export default function Checkout() {
  return <div className="wrap simple-page narrow"><Breadcrumbs items={[{ label: 'Shopping bag', href: '/cart' }, { label: 'Demo checkout' }]} />
    <div className="page-heading"><p className="eyebrow">Demonstration only</p><h1>Checkout <em>preview.</em></h1><p>Review your selection and its illustrative subtotal. This preview ends at the order summary.</p></div>
    <Bag mode="checkout" /><div className="checkout-return"><TextLink href="/cart">Return to your bag</TextLink></div></div>;
}
