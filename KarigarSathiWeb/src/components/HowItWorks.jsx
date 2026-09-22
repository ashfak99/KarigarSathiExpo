import { STEPS } from '../data/content';

export default function HowItWorks() {
  return (
    <section id="how" className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Sirf 6 Aasan Steps
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            5 minute mein aapka professional resume ready
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className="relative bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100"
            >
              <div className="absolute -top-4 left-6 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                {step.num}
              </div>
              <div className="pt-4">
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>

              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-primary/30 text-2xl">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}