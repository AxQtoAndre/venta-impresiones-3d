import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import materialsImg from '@/src/assets/images/material_spools_rack_1794701461876.jpg';
import { MATERIALS, MaterialId } from '@/src/data/catalog';

interface MaterialsSectionProps {
  selectedMaterial: MaterialId;
  onSelectForCalculator: (materialId: MaterialId) => void;
}

export default function MaterialsSection({
  selectedMaterial,
  onSelectForCalculator,
}: MaterialsSectionProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="materials" className="border-b border-[#242E42] bg-[#090D14] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="text-sm font-medium text-[#38BDF8]">Engineering Polymers</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Materials Calibrated for Lab & Field Loads
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#CBD5E1] sm:text-base">
              Select a filament below to inspect thermal deflection, tensile strength, and academic
              per-gram rates. Click any polymer to load it directly into the student quote
              calculator.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="relative h-56 overflow-hidden rounded-xl border border-[#242E42] bg-[#111722] sm:h-64">
              {!imgError ? (
                <img
                  src={materialsImg}
                  alt="Printed sample parts in matte PLA, translucent blue PETG, industrial grey ASA, and flexible TPU 95A"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[#141C2A] p-6 text-sm text-[#94A3B8]">
                  PLA · PETG · ABS/ASA · TPU 95A Mechanical Test Specimens
                </div>
              )}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090D14]/80 via-transparent to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 px-5 py-3">
                <p className="text-xs font-medium text-[#CBD5E1]">
                  In-Stock Test Specimens · Dry-Box Stored Before Every Print
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Material Cards */}
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {MATERIALS.map((mat) => {
            const isActive = selectedMaterial === mat.id;
            return (
              <div
                key={mat.id}
                className={`flex flex-col justify-between rounded-xl border p-6 transition-colors duration-150 ${
                  isActive
                    ? 'border-[#F97316] bg-[#131B29]'
                    : 'border-[#242E42] bg-[#111722] hover:border-[#364460]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl font-bold text-white">{mat.name}</h3>
                      <p className="mt-1 text-xs text-[#94A3B8]">{mat.colorsAvailable}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono text-xl font-semibold text-[#F97316] tabular-nums">
                        ${mat.ratePerGram.toFixed(2)}
                        <span className="text-xs font-normal text-[#94A3B8]"> / g</span>
                      </p>
                      <p className="text-xs text-[#94A3B8]">Base student rate</p>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-[#CBD5E1]">{mat.summary}</p>

                  {/* Unboxed Property Specifications */}
                  <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-[#242E42] pt-4 text-xs">
                    <div>
                      <dt className="text-[#94A3B8]">Tensile</dt>
                      <dd className="mt-0.5 font-mono font-medium text-white tabular-nums">
                        {mat.properties.tensileStrength}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#94A3B8]">Heat Limit</dt>
                      <dd className="mt-0.5 font-mono font-medium text-white tabular-nums">
                        {mat.properties.heatDeflection}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#94A3B8]">Surface</dt>
                      <dd className="mt-0.5 font-medium text-white">{mat.properties.finish}</dd>
                    </div>
                  </dl>

                  <p className="mt-4 text-xs leading-relaxed text-[#94A3B8]">
                    <strong className="font-medium text-[#CBD5E1]">Academic Use Cases:</strong>{' '}
                    {mat.useCases}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[#242E42] pt-4">
                  <span className="text-xs font-medium text-[#94A3B8]">
                    {isActive ? 'Selected in Quote Calculator' : 'Ready for 24–48h dispatch'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectForCalculator(mat.id)}
                    className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316] ${
                      isActive
                        ? 'bg-[#F97316] text-[#090D14] hover:bg-[#FB923C]'
                        : 'border border-[#2C384E] bg-[#171F2E] text-white hover:border-[#F97316] hover:text-[#F97316]'
                    }`}
                  >
                    Estimate with {mat.shortName}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
