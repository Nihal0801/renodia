import { MaisonFeature, Signature } from '@/components/editorial';
export const metadata = { title: 'The Maison' };
export default function Maison() {
  return <><div className="wrap page-heading centered"><p className="eyebrow">The world of Renodia</p><h1>The <em>Maison.</em></h1><p>A point of view shaped by colour, form and light.</p></div><MaisonFeature /><Signature /></>;
}
