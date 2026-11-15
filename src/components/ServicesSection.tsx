import { Wrench } from 'lucide-react';
import { useState } from 'react';
import capstoneImg from '@/src/assets/images/service_capstone_gear_1794701461749.jpg';
import fixtureImg from '@/src/assets/images/cad_mesh_fixture_1794701462503.jpg';
import { SERVICES } from '@/src/data/catalog';

export default function ServicesSection() {
  const [capstoneError, setCapstoneError] = useState(false);
  const [fixtureError, setFixtureError] = useState(false);

  return (
    <section id="services" className="border-b border-[#242E42] bg-[#0B1018] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-[#F97316]">Workshop Capabilities</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Fabrication Services Built for Student Builds
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#94A3B8]">
            Whether you need a single bracket for robotics lab or a 14-piece planetary gearbox for
            your graduation defense, every job gets caliper-checked before handoff.
          </p>
        </div>

        {/* Asymmetric Editorial Bento Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Card 01 (Wide Feature + Photo) */}
          <article className="flex flex-col justify-between overflow-hidden rounded-xl border border-[#242E42] bg-[#111722] transition-colors duration-200 hover:border-[#364460] lg:col-span-7">
            <div className="p-6 sm:p-7">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-xl font-bold text-white">
                  {SERVICES[0].index}. {SERVICES[0].title}
                </h3>
                <span className="font-mono text-xs text-[#94A3B8] shrink-0">
                  {SERVICES[0].subtitle}
                </span>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#CBD5E1]">
                {SERVICES[0].description}
              </p>
              <p className="mt-4 font-mono text-xs text-[#38BDF8]">{SERVICES[0].specs}</p>
            </div>
            <div className="relative h-56 w-full border-t border-[#242E42] bg-[#0D131D] sm:h-64">
              {!capstoneError ? (
                <img
                  src={capstoneImg}
                  alt="3D printed planetary gearbox, NEMA stepper motor brackets, and ventilated enclosure with digital calipers"
                  referrerPolicy="no-referrer"
                  onError={() => setCapstoneError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[#141C2A] text-sm text-[#94A3B8]">
                  Capstone Planetary Gearbox & Motor Brackets
                </div>
              )}
            </div>
          </article>

          {/* Card 02 (Tall Fixture Card + Photo) */}
          <article className="flex flex-col justify-between overflow-hidden rounded-xl border border-[#242E42] bg-[#111722] transition-colors duration-200 hover:border-[#364460] lg:col-span-5">
            <div className="p-6 sm:p-7">
              <h3 className="font-display text-xl font-bold text-white">
                {SERVICES[1].index}. {SERVICES[1].title}
              </h3>
              <p className="mt-1 font-mono text-xs text-[#94A3B8]">{SERVICES[1].subtitle}</p>
              <p className="mt-3 text-sm leading-relaxed text-[#CBD5E1]">
                {SERVICES[1].description}
              </p>
              <p className="mt-4 font-mono text-xs text-[#38BDF8]">{SERVICES[1].specs}</p>
            </div>
            <div className="relative h-56 w-full border-t border-[#242E42] bg-[#0D131D] sm:h-64">
              {!fixtureError ? (
                <img
                  src={fixtureImg}
                  alt="Custom 3D printed sensor mount and PCB controller fixture attached to aluminum extrusion"
                  referrerPolicy="no-referrer"
                  onError={() => setFixtureError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[#141C2A] text-sm text-[#94A3B8]">
                  <Wrench className="mr-2 h-4 w-4 text-[#F97316]" />
                  Custom PCB & Sensor Mounting Jigs
                </div>
              )}
            </div>
          </article>

          {/* Card 03 */}
          <article className="flex flex-col justify-between rounded-xl border border-[#242E42] bg-[#111722] p-6 transition-colors duration-200 hover:border-[#364460] sm:p-7 lg:col-span-6">
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-xl font-bold text-white">
                  {SERVICES[2].index}. {SERVICES[2].title}
                </h3>
                <span className="font-mono text-xs text-[#94A3B8] shrink-0">
                  {SERVICES[2].subtitle}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#CBD5E1]">
                {SERVICES[2].description}
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-[#242E42] pt-4">
              <span className="font-mono text-xs text-[#38BDF8]">{SERVICES[2].specs}</span>
              <a
                href="#quote-form"
                className="text-xs font-semibold text-[#F97316] transition-colors hover:text-[#FB923C]"
              >
                Request Part →
              </a>
            </div>
          </article>

          {/* Card 04 */}
          <article className="flex flex-col justify-between rounded-xl border border-[#242E42] bg-[#111722] p-6 transition-colors duration-200 hover:border-[#364460] sm:p-7 lg:col-span-6">
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-xl font-bold text-white">
                  {SERVICES[3].index}. {SERVICES[3].title}
                </h3>
                <span className="font-mono text-xs text-[#94A3B8] shrink-0">
                  {SERVICES[3].subtitle}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#CBD5E1]">
                {SERVICES[3].description}
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-[#242E42] pt-4">
              <span className="font-mono text-xs text-[#38BDF8]">{SERVICES[3].specs}</span>
              <a
                href="#quote-form"
                className="text-xs font-semibold text-[#F97316] transition-colors hover:text-[#FB923C]"
              >
                Upload CAD File →
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
