import { FEATURES } from '../data/content';

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">
            Features
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Sab Kuch Jo Aapko Chahiye
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Simple, fast aur 100% offline — bina jhanjhat ke professional
            resume banayein
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 border border-gray-100"
            >
              <div className="w-14 h-14 rounded-xl bg-primary-light flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition">
                {f.icon}
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">
                {f.title}
              </h3>
              <p className="text-sm text-gray-500 mb-2 font-hindi">
                {f.titleHi}
              </p>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}