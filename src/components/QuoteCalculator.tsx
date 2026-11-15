import { Check } from 'lucide-react';
import {
  calculateEstimate,
  InfillOption,
  MATERIALS,
  MaterialId,
} from '@/src/data/catalog';

interface QuoteCalculatorProps {
  weightGrams: number;
  materialId: MaterialId;
  infill: InfillOption;
  studentDiscount: boolean;
  onWeightChange: (weight: number) => void;
  onMaterialChange: (materialId: MaterialId) => void;
  onInfillChange: (infill: InfillOption) => void;
  onDiscountChange: (enabled: boolean) => void;
  onApplyToOrder: (summaryText: string) => void;
}

const INFILL_OPTIONS: { value: InfillOption; label: string; note: string }[] = [
  { value: 20, label: '20% Infill', note: 'Standard Fit' },
  { value: 50, label: '50% Infill', note: 'Reinforced' },
  { value: 100, label: '100% Infill', note: 'Solid Load' },
];

export default function QuoteCalculator({
  weightGrams,
  materialId,
  infill,
  studentDiscount,
  onWeightChange,
  onMaterialChange,
  onInfillChange,
  onDiscountChange,
  onApplyToOrder,
}: QuoteCalculatorProps) {
  const activeMaterial = MATERIALS.find((m) => m.id === materialId) ?? MATERIALS[0];
  const estimate = calculateEstimate(weightGrams, materialId, infill, studentDiscount);

  const handleSubmitToForm = () => {
    const discountLabel = studentDiscount ? 'with -15% INTECAP Student Discount' : 'standard rate';
    const summary = `Estimated Build: ${weightGrams}g in ${activeMaterial.name} at ${infill}% infill (${discountLabel}). Calculator range: $${estimate.finalLow.toFixed(
      2
    )}–$${estimate.finalHigh.toFixed(2)} USD.`;
    onApplyToOrder(summary);
  };

  return (
    <section id="calculator" className="border-b border-[#242E42] bg-[#090D14] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-[#38BDF8]">Student Pricing Estimator</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Calculate Your Prototype Estimate
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#CBD5E1]">
            Enter the estimated filament weight from your slicer (PrusaSlicer, Cura, or Bambu
            Studio), pick a polymer and infill density, and preview your academic discount before
            uploading.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Controls Column */}
          <div className="space-y-7 rounded-xl border border-[#242E42] bg-[#111722] p-6 sm:p-8 lg:col-span-7">
            {/* Weight Input + Slider */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label htmlFor="part-weight-input" className="text-sm font-semibold text-white">
                  Estimated Part Weight (grams)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="part-weight-input"
                    type="number"
                    min={5}
                    max={1000}
                    step={5}
                    value={weightGrams}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (!Number.isNaN(val)) {
                        onWeightChange(Math.max(5, Math.min(1000, val)));
                      }
                    }}
                    className="w-24 rounded-lg border border-[#2C384E] bg-[#090D14] px-3 py-2 text-right font-mono text-sm font-semibold text-white tabular-nums focus:border-[#F97316] focus:outline-none"
                  />
                  <span className="font-mono text-xs text-[#94A3B8]">grams</span>
                </div>
              </div>

              <input
                type="range"
                aria-label="Part weight slider in grams"
                min={5}
                max={500}
                step={5}
                value={Math.min(500, weightGrams)}
                onChange={(e) => onWeightChange(Number(e.target.value))}
                className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#242E42] accent-[#F97316]"
              />
              <div className="mt-1.5 flex justify-between font-mono text-xs text-[#94A3B8] tabular-nums">
                <span>5 g (Sensor clip)</span>
                <span>150 g (Motor bracket)</span>
                <span>500 g+ (Large enclosure)</span>
              </div>
            </div>

            {/* Material Selector */}
            <div>
              <span className="block text-sm font-semibold text-white">Select Polymer</span>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {MATERIALS.map((mat) => {
                  const selected = mat.id === materialId;
                  return (
                    <button
                      key={mat.id}
                      type="button"
                      onClick={() => onMaterialChange(mat.id)}
                      className={`flex min-h-[44px] flex-col items-start justify-center rounded-lg border px-3.5 py-2.5 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316] ${
                        selected
                          ? 'border-[#F97316] bg-[#F97316]/12 text-white'
                          : 'border-[#2C384E] bg-[#090D14] text-[#CBD5E1] hover:border-[#475878]'
                      }`}
                    >
                      <span className="text-sm font-semibold whitespace-nowrap">
                        {mat.shortName}
                      </span>
                      <span className="font-mono text-xs text-[#94A3B8] tabular-nums">
                        ${mat.ratePerGram.toFixed(2)}/g
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Infill Density Selector */}
            <div>
              <span className="block text-sm font-semibold text-white">Infill Density</span>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {INFILL_OPTIONS.map((opt) => {
                  const selected = opt.value === infill;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onInfillChange(opt.value)}
                      className={`flex min-h-[44px] flex-col items-start justify-center rounded-lg border px-3.5 py-2.5 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316] ${
                        selected
                          ? 'border-[#38BDF8] bg-[#38BDF8]/12 text-white'
                          : 'border-[#2C384E] bg-[#090D14] text-[#CBD5E1] hover:border-[#475878]'
                      }`}
                    >
                      <span className="font-mono text-sm font-semibold whitespace-nowrap tabular-nums">
                        {opt.label}
                      </span>
                      <span className="text-xs text-[#94A3B8]">{opt.note}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Student Discount Toggle */}
            <label className="flex min-h-[44px] cursor-pointer items-center justify-between gap-4 rounded-lg border border-[#2C384E] bg-[#090D14] px-4 py-3 transition-colors hover:border-[#475878]">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={studentDiscount}
                  onChange={(e) => onDiscountChange(e.target.checked)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                    studentDiscount
                      ? 'border-[#F97316] bg-[#F97316] text-[#090D14]'
                      : 'border-[#475878] bg-[#111722] text-transparent'
                  }`}
                >
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </span>
                <div>
                  <span className="block text-sm font-semibold text-white">
                    INTECAP Student Discount (-15%)
                  </span>
                  <span className="block text-xs text-[#94A3B8]">
                    Valid with active INTECAP Carnet or campus program ID
                  </span>
                </div>
              </div>
              <span className="font-mono text-xs font-semibold text-[#F97316] whitespace-nowrap">
                {studentDiscount ? 'APPLIED' : 'OFF'}
              </span>
            </label>
          </div>

          {/* Live Readout Column */}
          <div className="flex flex-col justify-between rounded-xl border border-[#242E42] bg-[#111722] p-6 sm:p-8 lg:col-span-5">
            <div>
              <p className="text-xs font-medium text-[#94A3B8]">Estimated Student Price Range</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-mono text-4xl font-bold tracking-tight text-white tabular-nums">
                  ${estimate.finalLow.toFixed(2)} – ${estimate.finalHigh.toFixed(2)}
                </span>
                <span className="font-mono text-sm text-[#94A3B8]">USD</span>
              </div>
              <p className="mt-2 text-xs text-[#94A3B8]">
                Includes material, CoreXY machine prep, and caliper dimensional check.
              </p>

              <dl className="mt-6 space-y-3 border-t border-[#242E42] pt-5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[#94A3B8]">Selected Material</dt>
                  <dd className="font-medium text-white">{activeMaterial.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#94A3B8]">Part Weight & Infill</dt>
                  <dd className="font-mono text-white tabular-nums">
                    {weightGrams} g · {infill}%
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#94A3B8]">Filament & Prep Subtotal</dt>
                  <dd className="font-mono text-white tabular-nums">
                    ${estimate.subtotal.toFixed(2)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#94A3B8]">Academic Discount (-15%)</dt>
                  <dd className="font-mono text-[#38BDF8] tabular-nums">
                    {studentDiscount ? `-$${estimate.discountAmount.toFixed(2)}` : '$0.00'}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-[#242E42] pt-3">
                  <dt className="text-[#94A3B8]">Estimated Print Time</dt>
                  <dd className="font-mono font-medium text-white tabular-nums">
                    {estimate.estimatedHours}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={handleSubmitToForm}
                className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[#F97316] px-5 py-3 text-sm font-semibold text-[#090D14] transition-colors duration-150 hover:bg-[#FB923C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316]"
              >
                Use Estimate & Submit Order
              </button>
              <p className="mt-2.5 text-center text-xs text-[#94A3B8]">
                Final exact quote confirmed after CAD mesh check
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
