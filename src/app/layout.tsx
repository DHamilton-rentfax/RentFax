import type { Metadata } from 'next';
import { AppProviders } from '@/components/AppProviders';
import './globals.css';

export const metadata: Metadata = {
  title: 'RentFAX',
  description: 'Modern screening for modern landlords.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
