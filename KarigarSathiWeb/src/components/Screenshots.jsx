export default function Screenshots() {
  const screens = [
    {
      title: 'Form Bharein',
      color: 'from-blue-400 to-blue-600',
      emoji: '📝',
    },
    {
      title: 'Preview Dekhein',
      color: 'from-purple-400 to-purple-600',
      emoji: '👁️',
    },
    {
      title: 'Payment Karein',
      color: 'from-green-400 to-green-600',
      emoji: '💳',
    },
    {
      title: 'Download Karein',
      color: 'from-orange-400 to-orange-600',
      emoji: '📥',
    },
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">
            Screenshots
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            App Kaise Dikhta Hai?
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Simple aur clean interface — Hindi mein samjhaya gaya
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {screens.map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`w-full aspect-[9/16] bg-gradient-to-br ${s.color} rounded-2xl shadow-lg flex items-center justify-center text-6xl hover:scale-105 transition duration-300`}
              >
                {s.emoji}
              </div>
              <p className="mt-3 font-semibold text-gray-800 text-sm text-center">
                {s.title}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          * Actual app screenshots jald add honge
        </p>
      </div>
    </section>
  );
}