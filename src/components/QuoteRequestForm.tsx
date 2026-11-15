import { CheckCircle2, FileUp, X } from 'lucide-react';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { CAREER_DEPARTMENTS } from '@/src/data/catalog';

interface QuoteRequestFormProps {
  prefilledEstimateNote: string;
}

interface SubmittedOrder {
  referenceId: string;
  name: string;
  studentId: string;
  career: string;
  email: string;
  fileName: string;
}

export default function QuoteRequestForm({ prefilledEstimateNote }: QuoteRequestFormProps) {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [career, setCareer] = useState(CAREER_DEPARTMENTS[0]);
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [fileInfo, setFileInfo] = useState<{ name: string; sizeLabel: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedOrder, setSubmittedOrder] = useState<SubmittedOrder | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!prefilledEstimateNote) return;
    setDescription((prev) => {
      const cleaned = prev.replace(/^Estimated Build:.*\n?/m, '').trim();
      return cleaned ? `${prefilledEstimateNote}\n\n${cleaned}` : prefilledEstimateNote;
    });
  }, [prefilledEstimateNote]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeKB = file.size / 1024;
    const sizeLabel =
      sizeKB >= 1024 ? `${(sizeKB / 1024).toFixed(2)} MB` : `${Math.max(1, Math.round(sizeKB))} KB`;
    setFileInfo({ name: file.name, sizeLabel });
    setErrorMsg('');
  };

  const clearFile = () => {
    setFileInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!studentId.trim()) {
      setErrorMsg('Please enter your INTECAP Carnet or Student ID.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid contact email address.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please describe your part requirements, quantity, or target deadline.');
      return;
    }

    setErrorMsg('');
    const refNumber = `PF-${Math.floor(10000 + Math.random() * 90000)}`;
    setSubmittedOrder({
      referenceId: refNumber,
      name: name.trim(),
      studentId: studentId.trim(),
      career,
      email: email.trim(),
      fileName: fileInfo ? fileInfo.name : 'CAD file to be sent via follow-up email',
    });
  };

  const handleReset = () => {
    setSubmittedOrder(null);
    setName('');
    setStudentId('');
    setEmail('');
    setDescription('');
    clearFile();
  };

  return (
    <section id="quote-form" className="border-b border-[#242E42] bg-[#0B1018] py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-medium text-[#F97316]">Upload CAD & Confirm Order</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Request a Student Fabrication Quote
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#CBD5E1]">
            Attach your STL, OBJ, or STEP model below. Our workshop technicians verify wall
            thickness, tolerances, and your -15% INTECAP student rate within 2 business hours.
          </p>
        </div>

        {submittedOrder ? (
          <div
            role="status"
            aria-live="polite"
            className="mt-10 rounded-xl border border-[#38BDF8]/50 bg-[#111722] p-8"
          >
            <div className="flex items-start gap-4">
              <CheckCircle2 className="mt-0.5 h-7 w-7 shrink-0 text-[#38BDF8]" />
              <div className="flex-1">
                <h3 className="font-display text-2xl font-bold text-white">
                  Print Request Logged — Reference {submittedOrder.referenceId}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
                  Thank you, <strong className="text-white">{submittedOrder.name}</strong>. We have
                  queued your mesh inspection for{' '}
                  <span className="font-mono text-white">{submittedOrder.studentId}</span> (
                  {submittedOrder.career}). A slicer confirmation and final invoice will be sent to{' '}
                  <span className="text-white">{submittedOrder.email}</span>.
                </p>

                <dl className="mt-5 grid grid-cols-1 gap-3 border-t border-[#242E42] pt-4 text-xs sm:grid-cols-2">
                  <div>
                    <dt className="text-[#94A3B8]">Attached Geometry</dt>
                    <dd className="mt-0.5 font-mono text-white">{submittedOrder.fileName}</dd>
                  </div>
                  <div>
                    <dt className="text-[#94A3B8]">Workshop Verification</dt>
                    <dd className="mt-0.5 text-white">-15% INTECAP Academic Rate Pending Check</dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-lg border border-[#2C384E] bg-[#171F2E] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-[#F97316] hover:text-[#F97316] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316]"
                >
                  Submit Another Part
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-10 space-y-6 rounded-xl border border-[#242E42] bg-[#111722] p-6 sm:p-8"
          >
            {errorMsg && (
              <div
                role="alert"
                className="rounded-lg border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-200"
              >
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="student-name" className="block text-sm font-medium text-white">
                  Full Name
                </label>
                <input
                  id="student-name"
                  type="text"
                  required
                  placeholder="e.g., Carlos Mendoza"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 min-h-[44px] w-full rounded-lg border border-[#2C384E] bg-[#090D14] px-3.5 py-2.5 text-sm text-white placeholder-[#64748B] focus:border-[#F97316] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="student-carnet" className="block text-sm font-medium text-white">
                  INTECAP Carnet / Student ID
                </label>
                <input
                  id="student-carnet"
                  type="text"
                  required
                  placeholder="e.g., 2026-IND-0482"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="mt-2 min-h-[44px] w-full rounded-lg border border-[#2C384E] bg-[#090D14] px-3.5 py-2.5 font-mono text-sm text-white placeholder-[#64748B] focus:border-[#F97316] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="student-career" className="block text-sm font-medium text-white">
                  Career / Workshop Department
                </label>
                <select
                  id="student-career"
                  value={career}
                  onChange={(e) => setCareer(e.target.value)}
                  className="mt-2 min-h-[44px] w-full rounded-lg border border-[#2C384E] bg-[#090D14] px-3.5 py-2.5 text-sm text-white focus:border-[#F97316] focus:outline-none"
                >
                  {CAREER_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="student-email" className="block text-sm font-medium text-white">
                  Student Email
                </label>
                <input
                  id="student-email"
                  type="email"
                  required
                  placeholder="c.mendoza@intecap-student.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 min-h-[44px] w-full rounded-lg border border-[#2C384E] bg-[#090D14] px-3.5 py-2.5 text-sm text-white placeholder-[#64748B] focus:border-[#F97316] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="project-notes" className="block text-sm font-medium text-white">
                Project Description & Tolerance Notes
              </label>
              <textarea
                id="project-notes"
                rows={4}
                required
                placeholder="Describe quantity, critical bearing/screw hole tolerances (e.g., M4 press-fit), preferred filament color, and your lab evaluation deadline..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 w-full rounded-lg border border-[#2C384E] bg-[#090D14] px-3.5 py-2.5 text-sm leading-relaxed text-white placeholder-[#64748B] focus:border-[#F97316] focus:outline-none"
              />
            </div>

            {/* CAD File Upload */}
            <div>
              <span className="block text-sm font-medium text-white">
                CAD Model File (.stl, .obj, .step, .stp, .3mf)
              </span>
              <div className="mt-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-[#364460] bg-[#090D14] px-4 py-6 text-center transition-colors hover:border-[#F97316]">
                {fileInfo ? (
                  <div className="flex w-full max-w-md items-center justify-between gap-3 rounded-md border border-[#2C384E] bg-[#111722] px-4 py-2.5">
                    <div className="truncate text-left">
                      <p className="truncate font-mono text-sm font-medium text-white">
                        {fileInfo.name}
                      </p>
                      <p className="font-mono text-xs text-[#94A3B8]">{fileInfo.sizeLabel}</p>
                    </div>
                    <button
                      type="button"
                      onClick={clearFile}
                      aria-label="Remove attached CAD file"
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#94A3B8] transition-colors hover:bg-[#1E293B] hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="cad-file-upload"
                    className="flex cursor-pointer flex-col items-center gap-2"
                  >
                    <FileUp className="h-6 w-6 text-[#F97316]" />
                    <span className="text-sm font-medium text-white">
                      Click to attach CAD export
                    </span>
                    <span className="text-xs text-[#94A3B8]">
                      Accepted: STL, OBJ, STEP, STP, 3MF · Max 50 MB per upload
                    </span>
                  </label>
                )}
                <input
                  ref={fileInputRef}
                  id="cad-file-upload"
                  type="file"
                  accept=".stl,.obj,.step,.stp,.3mf"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 border-t border-[#242E42] pt-5 sm:flex-row">
              <p className="text-xs text-[#94A3B8]">
                No payment required upfront. Pay upon slicing confirmation or campus pickup.
              </p>
              <button
                type="submit"
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[#F97316] px-6 py-3 text-sm font-semibold text-[#090D14] whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#FB923C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316] sm:w-auto"
              >
                Submit Print Request
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
