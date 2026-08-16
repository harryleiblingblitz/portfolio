import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pb-32 pt-32 sm:pt-40">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
