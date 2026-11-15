import Hero3DViewer from '@/src/components/Hero3DViewer';

const WORKSHOP_SPECS = [
  { label: 'Layer Resolution', value: '0.10 – 0.28 mm' },
  { label: 'Max Build Volume', value: '300 × 300 × 320 mm' },
  { label: 'Academic Turnaround', value: '24 – 48 Hours' },
  { label: 'INTECAP Student Rate', value: '-15% Off All Orders' },
];

export default function HeroSection() {
  return (
    <section id="top" className="border-b border-[#242E42] bg-[#090D14]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Copy Column */}
          <div className="flex flex-col justify-center lg:col-span-5">
            <p className="mb-4 text-sm font-medium tracking-wide text-[#94A3B8]">
              INTECAP Technical Workshop · On-Demand Additive Manufacturing
            </p>

            <h1 className="font-display text-[clamp(2.25rem,3.8vw,3.35rem)] font-bold leading-[1.08] tracking-tight text-white">
              Precision 3D Printing for Technical Capstones
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#CBD5E1]">
              Turn SolidWorks, Fusion 360, and Inventor designs into durable mechanical parts,
              enclosures, and graduation prototypes—backed by verified student discounts, engineering
              polymers, and turnaround matched to your lab deadlines.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#calculator"
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#F97316] px-6 py-3 text-sm font-semibold text-[#090D14] whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#FB923C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316]"
              >
                Calculate Student Quote
              </a>

              <a
                href="#materials"
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-[#2C384E] bg-[#111722] px-6 py-3 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[#475878] hover:bg-[#171F2E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38BDF8]"
              >
                View Technical Specs
              </a>
            </div>
          </div>

          {/* Right Interactive 3D Viewport Column */}
          <div className="lg:col-span-7">
            <Hero3DViewer />
          </div>
        </div>

        {/* Full-Width 4-Column Specification Strip */}
        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-[#242E42] bg-[#242E42] sm:grid-cols-2 lg:grid-cols-4">
          {WORKSHOP_SPECS.map((spec) => (
            <div key={spec.label} className="bg-[#111722] px-5 py-4">
              <p className="text-xs font-medium text-[#94A3B8]">{spec.label}</p>
              <p className="mt-1 font-mono text-base font-medium text-white tabular-nums">
                {spec.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
