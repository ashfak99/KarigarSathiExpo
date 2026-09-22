import { INSTALL_STEPS } from '../data/content';

export default function Installation() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">
            Installation
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Kaise Install Karein?
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Sirf 4 aasan steps mein app ready
          </p>
        </div>

        <div className="space-y-4">
          {INSTALL_STEPS.map((step) => (
            <div
              key={step.num}
              className="flex gap-5 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                {step.num}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl p-5">
          <p className="text-sm text-yellow-900">
            <strong>⚠️ Note:</strong> App Play Store pe nahi hai, isliye
            "Unknown Sources" allow karna zaroori hai. Yeh sirf ek baar karna
            hota hai — install ke baad app normally chalega.
          </p>
        </div>
      </div>
    </section>
  );
}