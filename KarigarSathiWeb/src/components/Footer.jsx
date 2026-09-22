export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl">
                K
              </div>
              <span className="font-bold text-lg">Karigar Sathi</span>
            </div>
            <p className="text-gray-400 text-sm font-hindi">
              कारीगरों का डिजिटल साथी
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-3 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#features" className="hover:text-white transition">
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#professions"
                  className="hover:text-white transition"
                >
                  Professions
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-3 text-sm uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="mailto:support@karigarsathi.com"
                  className="hover:text-white transition"
                >
                  support@karigarsathi.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between gap-4 text-sm text-gray-500">
          <p>© {year} Karigar Sathi. All rights reserved.</p>
          <p>Made with ❤️ for Indian Workers</p>
        </div>
      </div>
    </footer>
  );
}