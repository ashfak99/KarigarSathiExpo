import { APK_URL } from '../data/content';

export default function CTA() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary to-primary-dark">
      <div className="max-w-3xl mx-auto text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Aaj Hi Apna Resume Banayein
        </h2>
        <p className="text-lg opacity-90 mb-8 font-hindi">
          सिर्फ 5 मिनट में, सिर्फ ₹20 में
        </p>

        <a
          href={APK_URL}
          download
          className="inline-flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:scale-105 transition transform"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 16l-6-6h4V4h4v6h4l-6 6zm-8 4h16v-2H4v2z" />
          </svg>
          Download APK Free
        </a>

        <p className="mt-6 text-sm opacity-75">
          No signup required · 100% offline · Data safe
        </p>
      </div>
    </section>
  );
}