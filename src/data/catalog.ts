export type MaterialId = 'pla' | 'petg' | 'abs' | 'tpu';
export type InfillOption = 20 | 50 | 100;

export interface MaterialSpec {
  id: MaterialId;
  name: string;
  shortName: string;
  ratePerGram: number;
  summary: string;
  properties: {
    tensileStrength: string;
    heatDeflection: string;
    finish: string;
  };
  useCases: string;
  colorsAvailable: string;
}

export const MATERIALS: MaterialSpec[] = [
  {
    id: 'pla',
    name: 'PLA+ Engineering',
    shortName: 'PLA',
    ratePerGram: 0.08,
    summary: 'Budget-friendly rigid polymer ideal for fast dimensional verification and visual thesis models.',
    properties: {
      tensileStrength: '60 MPa',
      heatDeflection: '55 °C',
      finish: 'Crisp matte detail',
    },
    useCases: 'Concept mockups, architectural scale models, sensor housings, initial fit-check prototypes.',
    colorsAvailable: 'Matte Black · Cool Grey · Safety Orange · Signal White',
  },
  {
    id: 'petg',
    name: 'PETG Mechanical',
    shortName: 'PETG',
    ratePerGram: 0.11,
    summary: 'Tough, impact-resistant copolymer with strong layer adhesion for functional student builds.',
    properties: {
      tensileStrength: '53 MPa',
      heatDeflection: '74 °C',
      finish: 'Semi-gloss chemical resistant',
    },
    useCases: 'Robotics chassis plates, NEMA motor brackets, fluid manifolds, snap-fit enclosures.',
    colorsAvailable: 'Carbon Black · Translucent Cobalt · Natural Clear · Slate',
  },
  {
    id: 'abs',
    name: 'ABS / ASA Industrial',
    shortName: 'ABS/ASA',
    ratePerGram: 0.14,
    summary: 'High-temperature, UV-stable structural polymer printed in actively heated enclosures.',
    properties: {
      tensileStrength: '48 MPa',
      heatDeflection: '96 °C',
      finish: 'Matte machinable surface',
    },
    useCases: 'Automotive under-hood ducts, drill jigs, outdoor telemetry boxes, heat-exposed fixtures.',
    colorsAvailable: 'Industrial Grey · Jet Black · High-Vis Orange',
  },
  {
    id: 'tpu',
    name: 'TPU 95A Elastomer',
    shortName: 'TPU',
    ratePerGram: 0.16,
    summary: 'Flexible abrasion-resistant elastomer engineered for vibration damping and high-grip tires.',
    properties: {
      tensileStrength: '38 MPa (Shore 95A)',
      heatDeflection: '68 °C',
      finish: 'Textured high-grip',
    },
    useCases: 'Sumo-bot wheels, drone landing skids, pneumatic gaskets, vibration isolation mounts.',
    colorsAvailable: 'Graphite Black · Signal Orange',
  },
];

export interface ServiceItem {
  index: string;
  title: string;
  subtitle: string;
  description: string;
  specs: string;
}

export const SERVICES: ServiceItem[] = [
  {
    index: '01',
    title: 'Capstone & Thesis Prototyping',
    subtitle: 'Graduation Builds · Functional Assemblies',
    description:
      'Turn final-year engineering drawings into load-bearing, multi-part physical assemblies calibrated to tight M3/M4 hardware clearances before your jury evaluation.',
    specs: '±0.15 mm XY tolerance · Brass heat-set inserts available',
  },
  {
    index: '02',
    title: 'Custom Jigs & Fixtures',
    subtitle: 'Electronics Enclosures · Mechanical Mounts',
    description:
      'Purpose-built soldering jigs, Arduino/PLC DIN-rail brackets, sensor alignment mounts, and ventilated control boxes tailored to your lab wiring layout.',
    specs: 'Custom standoff patterns · Snug PCB snap tolerances',
  },
  {
    index: '03',
    title: 'Mechanical Replacement Parts',
    subtitle: 'Workshop Equipment · Lab Tools',
    description:
      'Replace cracked lathe handwheels, worn timing belt pulleys, vacuum dust adapters, and broken instrument knobs without waiting weeks for OEM shipping.',
    specs: 'High-infill structural shells · Oil & coolant resistant PETG/ASA',
  },
  {
    index: '04',
    title: 'CAD Assistance & Mesh Repair',
    subtitle: 'SolidWorks · Fusion 360 · Autodesk Inventor',
    description:
      'Export issues before a deadline? We inspect non-manifold edges, repair wall thickness errors, split oversized parts for assembly, and convert STEP/SLDPRT files cleanly.',
    specs: 'Free pre-flight mesh check · Optimal print orientation',
  },
];

export const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Upload CAD & Career Info',
    detail:
      'Submit your STL, STEP, or OBJ export along with your INTECAP career track and target tolerance notes.',
    meta: 'Instant file check · SolidWorks / Fusion 360 ready',
  },
  {
    step: '02',
    title: 'Select Material & Student ID',
    detail:
      'Choose PLA, PETG, ABS/ASA, or TPU and apply your active INTECAP Carnet ID to unlock automatic -15% academic pricing.',
    meta: 'Transparent per-gram rate · Zero setup surcharge',
  },
  {
    step: '03',
    title: 'Precision Print & Pickup',
    detail:
      'Parts are sliced on calibrated CoreXY machines, measured with digital calipers, and ready for campus pickup or local courier.',
    meta: '24–48 hr standard turnaround · Rush capstone queue',
  },
];

export const FAQ_ITEMS = [
  {
    question: 'How does the INTECAP -15% student discount work?',
    answer:
      'Enter your active INTECAP Carnet or Student ID in the quote calculator or order form. We verify enrollment at pickup or via campus email and automatically deduct 15% from your total filament and machine-time estimate on both single prototypes and multi-part capstone batches.',
  },
  {
    question: 'Which CAD software and file formats do you accept?',
    answer:
      'We slice directly from high-resolution STL, 3MF, OBJ, and native engineering STEP (.step / .stp) files. If you work in SolidWorks, Autodesk Inventor, or Fusion 360 and run into export or mesh-stitching issues, select CAD Assistance in the form and we will convert and repair the geometry before printing.',
  },
  {
    question: 'What is the maximum single-piece build volume?',
    answer:
      'Our primary CoreXY enclosures handle single parts up to 300 × 300 × 320 mm. For larger robot frames, wind-tunnel ducts, or machine guards, our technicians can section your model with alignment dowels and adhesive lap joints at no extra design charge.',
  },
  {
    question: 'What are typical lead times during midterm and capstone exam weeks?',
    answer:
      'Standard turnaround is 24 to 48 hours from quote confirmation. During final evaluation weeks, we dedicate overnight printer capacity exclusively to verified INTECAP graduation projects so your parts arrive before defense day—just note your evaluation date in the project description.',
  },
];

export const CAREER_DEPARTMENTS = [
  'Industrial Mechanics & Machining',
  'Electronics & Embedded Systems',
  'Mechatronics & Robotics',
  'Automotive Mechanics',
  'Industrial Automation & PLC',
  'CAD / Mechanical Drafting',
  'Refrigeration & HVAC',
  'Other Technical Program',
];

export interface EstimateBreakdown {
  baseMaterialCost: number;
  infillMultiplier: number;
  subtotal: number;
  discountAmount: number;
  finalLow: number;
  finalHigh: number;
  estimatedHours: string;
}

export function calculateEstimate(
  weightGrams: number,
  materialId: MaterialId,
  infill: InfillOption,
  hasStudentDiscount: boolean
): EstimateBreakdown {
  const safeWeight = Math.max(5, Math.min(2000, Number.isFinite(weightGrams) ? weightGrams : 50));
  const material = MATERIALS.find((m) => m.id === materialId) ?? MATERIALS[0];

  const infillMultiplier = infill === 20 ? 1.0 : infill === 50 ? 1.18 : 1.38;
  const setupBase = 1.5;
  const baseMaterialCost = safeWeight * material.ratePerGram;
  const subtotal = setupBase + baseMaterialCost * infillMultiplier;
  const discountAmount = hasStudentDiscount ? subtotal * 0.15 : 0;
  const net = subtotal - discountAmount;

  const finalLow = Math.max(2.5, Number((net * 0.92).toFixed(2)));
  const finalHigh = Math.max(3.0, Number((net * 1.1).toFixed(2)));

  const hoursNumeric = Math.max(0.8, (safeWeight / 28) * infillMultiplier);
  const estimatedHours =
    hoursNumeric < 2
      ? `${hoursNumeric.toFixed(1)} hrs`
      : `${Math.floor(hoursNumeric)}–${Math.ceil(hoursNumeric + 1)} hrs`;

  return {
    baseMaterialCost,
    infillMultiplier,
    subtotal,
    discountAmount,
    finalLow,
    finalHigh,
    estimatedHours,
  };
}
