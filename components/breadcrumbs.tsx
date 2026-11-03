import Link from 'next/link';
export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link>{items.map(({ label, href }) =>
    <span key={label}><span aria-hidden="true">/</span>{href ? <Link href={href}>{label}</Link> : <span aria-current="page">{label}</span>}</span>
  )}</nav>;
}
