import './global.css';
import Provider from './provider';

export const metadata = {
  title: 'DATLEP Seller',
  description: 'DATLEP Seller Application, manage your products and sales',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Provider>
        {children}
        </Provider>
      </body>
    </html>
  )
}
