import {
  APK_URL,
  APK_VERSION,
  APK_SIZE,
  APK_MIN_ANDROID,
  STATS,
} from '../data/content';

export default function Hero() {
  return (
    <section
      id="home"
      className="relative pt-28 pb-16 px-4 bg-gradient-to-br from-primary via-primary to-primary-dark text-white overflow-hidden"
    >
      {/* Decorative blobs */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              v{APK_VERSION} · Available Now
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              Apna Professional
              <br />
              <span className="text-accent">Resume Banayein</span>
            </h1>

            <p className="text-lg md:text-xl opacity-90 mb-2 font-hindi">
              कारीगर साथी — आपका डिजिटल साथी
            </p>

            <p className="text-base md:text-lg opacity-80 mb-8 max-w-lg mx-auto md:mx-0">
              Electrician, Plumber, Carpenter, Driver — 12 professions ke
              liye. Sirf form bharein, professional English resume
              download karein.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start mb-6">
              <a
                href={APK_URL}
                download
                className="inline-flex items-center justify-center gap-2 bg-white text-primary px-7 py-3.5 rounded-full font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition transform"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 16l-6-6h4V4h4v6h4l-6 6zm-8 4h16v-2H4v2z" />
                </svg>
                Download APK
              </a>
              <a
                href="#how"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-white/20 transition"
              >
                Kaise Kaam Karta Hai?
              </a>
            </div>

            <p className="text-sm opacity-75">
              {APK_SIZE} · {APK_MIN_ANDROID} · 100% Free to Try
            </p>
          </div>

          {/* Right — Phone mockup */}
          <div className="flex justify-center md:justify-end">
            <div className="relative">
              <div className="w-64 md:w-72 bg-white rounded-[2.5rem] p-3 shadow-2xl rotate-3 hover:rotate-0 transition duration-500">
                <div className="bg-gray-100 rounded-[2rem] overflow-hidden aspect-[9/19] flex flex-col">
                  {/* Phone header */}
                  <div className="bg-primary text-white p-4 pb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm font-bold">
                        K
                      </div>
                      <span className="font-bold">Karigar Sathi</span>
                    </div>
                    <p className="text-xs opacity-90">Resume Ready! 🎉</p>
                  </div>

                  {/* Phone body */}
                  <div className="flex-1 p-4 space-y-3">
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="w-12 h-12 bg-primary-light rounded-full mx-auto mb-2 flex items-center justify-center">
                        <div className="w-6 h-6 bg-primary rounded-full" />
                      </div>
                      <p className="text-center text-xs font-semibold">
                        Ram Kumar
                      </p>
                      <p className="text-center text-[10px] text-gray-500">
                        Electrician
                      </p>
                    </div>
                    <div className="bg-whatsapp text-white rounded-lg p-2.5 text-center text-xs font-bold">
                      📤 Share on WhatsApp
                    </div>
                    <div className="bg-white border-2 border-success text-success rounded-lg p-2.5 text-center text-xs font-bold">
                      📥 Save to Device
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-accent text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg rotate-[-6deg]">
                Sirf ₹20
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-8 border-t border-white/15">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl md:text-4xl font-bold">{s.value}</p>
              <p className="text-sm opacity-80 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}