import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Home } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-7xl font-display font-extrabold gradient-text mb-4">404</h1>
          <p className="text-xl text-foreground font-display font-bold mb-2">Page not found</p>
          <p className="text-sm text-muted-foreground mb-8">The page you're looking for doesn't exist or has been moved.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
          >
            <Home size={16} />
            Back to Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
