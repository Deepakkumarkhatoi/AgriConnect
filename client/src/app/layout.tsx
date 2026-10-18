import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const metadata: Metadata = {
  title: 'AgriConnect — Smart Farmer Assistance & Produce Marketplace',
  description:
    'Integrated platform for farmers, buyers, agricultural officers, and administrators. Live mandi prices, weather forecasts, government schemes, and produce trade.',
  keywords: 'farmer, mandi prices, agmarknet, kisan, agriculture, government schemes, crop management, weather alerts',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900 selection:bg-emerald-200 selection:text-emerald-900">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 pb-16">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
