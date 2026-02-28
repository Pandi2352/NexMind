import { useState, useRef, useEffect } from 'react';
import type { CreateHealthConsultationDto, HealthConsultation } from '../../types';

interface HealthFormProps {
  consulting: boolean;
  onConsult: (dto: CreateHealthConsultationDto) => Promise<HealthConsultation | null>;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="flex shrink-0 cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-rose-400 transition-colors hover:bg-rose-100 hover:text-rose-600"
    >
      {copied ? (
        <>
          <svg className="h-3.5 w-3.5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span className="text-emerald-600">Copied!</span>
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

const genderOptions = [
  { value: '', label: 'Not specified' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export function HealthForm({ consulting, onConsult }: HealthFormProps) {
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [existingConditions, setExistingConditions] = useState('');
  const [result, setResult] = useState<HealthConsultation | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dto: CreateHealthConsultationDto = {
      symptoms,
      age: age ? Number(age) : undefined,
      gender: gender || undefined,
      existingConditions: existingConditions || undefined,
    };
    const res = await onConsult(dto);
    if (res) setResult(res);
  };

  const selectedGenderLabel = genderOptions.find(o => o.value === gender)?.label || 'Not specified';

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Symptoms <span className="text-red-400">*</span>
          </label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={4}
            required
            placeholder="Describe your symptoms in detail... (e.g., headache, fever, body ache, sore throat)"
            className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-slate-700">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 30"
              min={1}
              max={150}
              className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Gender</label>
            <div className="relative mt-1" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 transition-all focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
              >
                <span>{selectedGenderLabel}</span>
                <svg className={`h-4 w-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {dropdownOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white py-1 shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {genderOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setGender(opt.value);
                        setDropdownOpen(false);
                      }}
                      className={`flex w-full cursor-pointer items-center px-3 py-2 text-sm text-left transition-colors hover:bg-rose-50 hover:text-rose-700 ${
                        gender === opt.value ? 'bg-rose-50 font-medium text-rose-700' : 'text-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Existing Conditions</label>
            <input
              type="text"
              value={existingConditions}
              onChange={(e) => setExistingConditions(e.target.value)}
              placeholder="e.g. diabetes, asthma"
              className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={consulting || !symptoms.trim()}
          className="rounded-lg bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {consulting ? 'Analyzing Symptoms...' : 'Get Health Advice'}
        </button>
      </form>

      {result && (
        <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-500">
              Health Advice
            </p>
            <CopyButton text={result.advice} />
          </div>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-rose-900">
            {result.advice}
          </div>
        </div>
      )}
    </div>
  );
}
