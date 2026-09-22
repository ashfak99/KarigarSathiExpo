import { useState, useEffect } from 'react';
import { APK_URL } from '../data/content';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#features', label: 'Features' },
    { href: '#professions', label: 'Professions' },
    { href: '#how', label: 'Kaise Kaam Karta' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl">
            K
          </div>
          <span className="font-bold text-primary text-lg">
            Karigar Sathi
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-gray-700 hover:text-primary font-medium text-sm transition"
            >
              {l.label}
            </a>
          ))}
          <a
            href={APK_URL}
            download
            className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-full font-semibold text-sm transition shadow-md hover:shadow-lg"
          >
            Download
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center"
          aria-label="Menu"
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={`w-6 h-0.5 bg-gray-800 transition ${
                menuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-gray-800 transition ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-gray-800 transition ${
                menuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-md">
          <div className="px-4 py-3 flex flex-col gap-2">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="py-2 text-gray-700 hover:text-primary font-medium"
              >
                {l.label}
              </a>
            ))}
            <a
              href={APK_URL}
              download
              className="bg-primary text-white px-5 py-3 rounded-full font-semibold text-center mt-2"
            >
              Download APK
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}