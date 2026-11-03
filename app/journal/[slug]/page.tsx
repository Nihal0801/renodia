import Image from 'next/image';
import { notFound } from 'next/navigation';
import { articles } from '@/data/catalogue';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { TextLink } from '@/components/editorial';
type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => articles.map(({ slug }) => ({ slug }));
export default async function Article({ params }: Props) {
  const { slug } = await params;
  const article = articles.find(item => item.slug === slug);
  if (!article) notFound();
  return <article className="wrap simple-page article"><Breadcrumbs items={[{ label: 'Journal', href: '/journal' }, { label: article.title }]} />
    <div className="page-heading"><p className="eyebrow">{article.label} · Demo editorial</p><h1>{article.title}</h1></div>
    <div className="article-image"><Image src={article.image} fill sizes="(max-width: 900px) 100vw, 900px" alt="" /></div>
    <p>{article.text}</p><TextLink href="/journal">Back to the journal</TextLink>
  </article>;
}
