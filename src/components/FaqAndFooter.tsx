import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { FAQ_ITEMS } from '@/src/data/catalog';

export default function FaqAndFooter() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <section id="faq" className="border-b border-[#242E42] bg-[#090D14] py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div>
            <p className="text-sm font-medium text-[#38BDF8]">Student Questions</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-10 divide-y divide-[#242E42] rounded-xl border border-[#242E42] bg-[#111722]">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={item.question}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="flex min-h-[56px] w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-[#151D2B] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#F97316]"
                  >
                    <span className="font-display text-base font-semibold text-white sm:text-lg">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-[#94A3B8] transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#F97316]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm leading-relaxed text-[#CBD5E1]">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="bg-[#090D14] py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 border-b border-[#242E42] pb-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <a href="#top" className="font-display text-lg font-bold tracking-tight text-white">
                PrintForge INTECAP
              </a>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#94A3B8]">
                Student-focused rapid prototyping and additive manufacturing serving technical
                trainees, vocational workshops, and graduation capstone teams.
              </p>
            </div>

            <div className="md:col-span-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
                Navigation
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-[#94A3B8]">
                <li>
                  <a href="#services" className="transition-colors hover:text-white">
                    Workshop Services
                  </a>
                </li>
                <li>
                  <a href="#materials" className="transition-colors hover:text-white">
                    Materials & Specs
                  </a>
                </li>
                <li>
                  <a href="#calculator" className="transition-colors hover:text-white">
                    Student Estimator
                  </a>
                </li>
                <li>
                  <a href="#quote-form" className="transition-colors hover:text-white">
                    Upload Project
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
                Workshop Contact & Community
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-[#94A3B8]">
                <li>
                  Email:{' '}
                  <a
                    href="mailto:workshop@printforge-intecap.edu"
                    className="text-[#CBD5E1] transition-colors hover:text-[#F97316]"
                  >
                    workshop@printforge-intecap.edu
                  </a>
                </li>
                <li>Hours: Mon – Sat · 07:30 – 19:00</li>
                <li>Campus Pickup: Engineering & Mechanics Wing, Bay B-4</li>
                <li className="pt-1">
                  <a href="#how-it-works" className="text-[#38BDF8] hover:underline">
                    CAD Export Checklist
                  </a>{' '}
                  ·{' '}
                  <a href="#faq" className="text-[#38BDF8] hover:underline">
                    Capstone Priority Queue
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 text-xs text-[#64748B] sm:flex-row sm:items-center">
            <p>© 2026 PrintForge INTECAP. Precision Prototyping for Technical Trainees.</p>
            <p>Compatible with SolidWorks · Fusion 360 · Autodesk Inventor</p>
          </div>
        </div>
      </footer>
    </>
  );
}
