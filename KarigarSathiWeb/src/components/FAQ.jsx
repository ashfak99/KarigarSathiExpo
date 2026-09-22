import { useState } from 'react';
import { FAQS } from '../data/content';

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="py-20 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">
            FAQ
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Common Questions
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Jo sawaal sab poochte hain
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`rounded-2xl overflow-hidden border transition ${
                open === i
                  ? 'border-primary bg-primary-light/30'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex justify-between items-center gap-4 p-5 text-left hover:bg-gray-50/50 transition"
              >
                <span className="font-semibold text-gray-900">
                  {faq.q}
                </span>
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-lg font-bold transition ${
                    open === i
                      ? 'bg-primary text-white rotate-45'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  +
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  open === i ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <p className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}