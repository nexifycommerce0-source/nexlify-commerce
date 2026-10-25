import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';
import { site } from '@/lib/site';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollProgress from '@/components/ui/ScrollProgress';
import PageLoader from '@/components/ui/PageLoader';
import Cursor from '@/components/ui/Cursor';
import DragonBackground from '@/components/three/DragonBackground';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.fullName} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    'software agency',
    'web development',
    'AI solutions',
    'UI/UX design',
    'mobile app development',
    'e-commerce',
    'digital agency',
  ],
  authors: [{ name: site.fullName }],
  openGraph: {
    type: 'website',
    url: site.url,
    title: `${site.fullName} — ${site.tagline}`,
    description: site.description,
    siteName: site.fullName,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.fullName} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body>
        <PageLoader />
        <Cursor />
        <ScrollProgress />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: site.fullName,
              url: site.url,
              email: site.email,
              telephone: site.phone,
              address: {
                '@type': 'PostalAddress',
                streetAddress: site.address,
              },
              sameAs: Object.values(site.socials),
            }),
          }}
        />
        <DragonBackground />
      </body>
    </html>
  );
}
