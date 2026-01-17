import Header from '../shared/widgets';
import './global.css';
import { Poppins, Roboto } from 'next/font/google';
import Provider from './providers';

export const metadata = {
  title: 'Datlep - Digital Fashion Marketplace',
  description: 'DATLEP is a digital fashion marketplace that connects customers with tailors, shoemakers, fashion sellers, thrift stores, and repair services. Users can buy fabrics, ready-made fashion items, or send materials directly to bespoke creators using body measurements—all in one platform. DATLEP simplifies fashion commerce by combining craftsmanship, convenience, and technology.',
}

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '700', '900'],
  variable: '--font-roboto',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${roboto.variable} font-sans`}>
        <Provider>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        </Provider>
      </body>
    </html>
  )
}