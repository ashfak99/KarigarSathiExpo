import { PROFESSIONS } from '../data/content';

export default function Professions() {
  return (
    <section id="professions" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">
            Professions
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            12+ Kaam Ke Liye Ready
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Aap chahe koi bhi kaam karte ho — hum aapke liye professional
            resume banayenge
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {PROFESSIONS.map((p, i) => (
            <div
              key={i}
              className="group bg-gray-50 hover:bg-primary hover:text-white rounded-2xl p-5 text-center transition duration-300 cursor-default"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition">
                {p.icon}
              </div>
              <p className="font-semibold text-sm">{p.en}</p>
              <p className="text-xs opacity-70 font-hindi mt-1">{p.hi}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Aur bhi professions jald aa rahe hain...
        </p>
      </div>
    </section>
  );
}