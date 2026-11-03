import type { Metadata } from 'next';
import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/cormorant-garamond/latin-500.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import '@fontsource-variable/manrope/wght.css';
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/editorial';

export const metadata: Metadata = {
  title: { default: 'Renodia | Art in Every Detail', template: '%s | Renodia' },
  description: 'Discover the seven Renodia collections. An editorial jewellery storefront in colour and light.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Header><main id="main">{children}</main><Footer /></Header></body></html>;
}
