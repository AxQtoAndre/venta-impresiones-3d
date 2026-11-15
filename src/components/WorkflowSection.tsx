import { WORKFLOW_STEPS } from '@/src/data/catalog';

export default function WorkflowSection() {
  return (
    <section id="how-it-works" className="border-b border-[#242E42] bg-[#0B1018] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-[#F97316]">Project Guide</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              How It Works (Student Edition)
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#94A3B8]">
            From your CAD workstation to physical assembly in three straightforward steps—no minimum
            order quantities required.
          </p>
        </div>

        {/* 3-Step Visual Timeline */}
        <div className="relative mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Desktop Connector Line */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-7 right-12 left-12 hidden h-px bg-[#242E42] md:block"
          />

          {WORKFLOW_STEPS.map((item) => (
            <div
              key={item.step}
              className="relative flex flex-col justify-between rounded-xl border border-[#242E42] bg-[#111722] p-6"
            >
              <div>
                <div className="relative z-10 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#F97316]/40 bg-[#090D14] font-mono text-sm font-semibold text-[#F97316] tabular-nums">
                  {item.step}
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[#CBD5E1]">{item.detail}</p>
              </div>
              <p className="mt-6 border-t border-[#242E42] pt-3 text-xs font-medium text-[#94A3B8]">
                {item.meta}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
