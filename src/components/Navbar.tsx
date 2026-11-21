import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, PenLine, LayoutDashboard, BookOpen } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto max-w-5xl px-6 flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-display font-extrabold text-xs">B</span>
          </div>
          <span className="text-lg font-display font-extrabold text-foreground">Blogora</span>
        </Link>

        <div className="flex items-center gap-0.5">
          <NavItem to="/" icon={<BookOpen size={16} />} label="Blog" active={isActive('/')} />
          <NavItem to="/editor" icon={<PenLine size={16} />} label="Write" active={isActive('/editor')} />
          <NavItem to="/dashboard" icon={<LayoutDashboard size={16} />} label="Dashboard" active={isActive('/dashboard')} />
          
          <button
            onClick={toggleTheme}
            className="ml-1.5 p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

function NavItem({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-accent text-accent-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}

export default Navbar;
