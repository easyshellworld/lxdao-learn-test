'use client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen">
      <Header  />
      <main className="flex-grow overflow-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;