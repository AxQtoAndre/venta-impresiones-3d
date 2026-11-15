import { useState } from 'react';
import FaqAndFooter from '@/src/components/FaqAndFooter';
import HeroSection from '@/src/components/HeroSection';
import MaterialsSection from '@/src/components/MaterialsSection';
import Navbar from '@/src/components/Navbar';
import QuoteCalculator from '@/src/components/QuoteCalculator';
import QuoteRequestForm from '@/src/components/QuoteRequestForm';
import ServicesSection from '@/src/components/ServicesSection';
import WorkflowSection from '@/src/components/WorkflowSection';
import { InfillOption, MaterialId } from '@/src/data/catalog';

export default function App() {
  const [weightGrams, setWeightGrams] = useState<number>(85);
  const [materialId, setMaterialId] = useState<MaterialId>('petg');
  const [infill, setInfill] = useState<InfillOption>(50);
  const [studentDiscount, setStudentDiscount] = useState<boolean>(true);
  const [prefilledEstimateNote, setPrefilledEstimateNote] = useState<string>('');

  const handleSelectMaterialForCalculator = (id: MaterialId) => {
    setMaterialId(id);
    const el = document.getElementById('calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApplyEstimateToOrder = (summaryText: string) => {
    setPrefilledEstimateNote(summaryText);
    const el = document.getElementById('quote-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#090D14] text-[#F8FAFC]">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <MaterialsSection
          selectedMaterial={materialId}
          onSelectForCalculator={handleSelectMaterialForCalculator}
        />
        <WorkflowSection />
        <QuoteCalculator
          weightGrams={weightGrams}
          materialId={materialId}
          infill={infill}
          studentDiscount={studentDiscount}
          onWeightChange={setWeightGrams}
          onMaterialChange={setMaterialId}
          onInfillChange={setInfill}
          onDiscountChange={setStudentDiscount}
          onApplyToOrder={handleApplyEstimateToOrder}
        />
        <QuoteRequestForm prefilledEstimateNote={prefilledEstimateNote} />
      </main>
      <FaqAndFooter />
    </div>
  );
}
