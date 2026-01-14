import './globals.css';
import AppProviders from './providers';
import GlobalModals from '@/components/global/GlobalModals';

export const metadata = {
  title: 'RentFAX',
  description: 'Rental trust & verification platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          {children}
          <GlobalModals />
        </AppProviders>
      </body>
    </html>
  );
}
