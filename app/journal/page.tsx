import { JournalCards } from '@/components/editorial';
import { Breadcrumbs } from '@/components/breadcrumbs';
export const metadata = { title: 'Journal' };
export default function Journal() {
  return <div className="wrap simple-page"><Breadcrumbs items={[{ label: 'Journal' }]} /><div className="page-heading"><p className="eyebrow">Renodia · Editorial studies</p><h1>The <em>journal.</em></h1><p>Notes on colour and the pleasure of looking closely.</p></div><JournalCards /></div>;
}
