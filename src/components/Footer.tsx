import { Link } from 'react-router-dom';
import { BookOpen, PenLine, LayoutDashboard, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50 mt-auto">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-extrabold text-xs">B</span>
              </div>
              <span className="text-lg font-display font-extrabold text-foreground">Blogora</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-xs">
              A modern blog platform. Write, publish, and share your ideas with the world.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">Navigate</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2">
                  <BookOpen size={13} /> Home
                </Link>
              </li>
              <li>
                <Link to="/editor" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2">
                  <PenLine size={13} /> Write
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2">
                  <LayoutDashboard size={13} /> Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">Resources</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-muted-foreground">Markdown Guide</span></li>
              <li><span className="text-sm text-muted-foreground">Writing Tips</span></li>
              <li><span className="text-sm text-muted-foreground">API Docs</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">Connect</h4>
            <div className="flex items-center gap-2">
              {[
                { href: 'https://twitter.com', icon: <Twitter size={15} />, label: 'Twitter' },
                { href: 'https://github.com', icon: <Github size={15} />, label: 'GitHub' },
                { href: 'https://linkedin.com', icon: <Linkedin size={15} />, label: 'LinkedIn' },
              ].map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-secondary hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors"
                  aria-label={label}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Blogora
          </p>
          <p className="text-xs text-muted-foreground">
            Built with AI
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
