import { CheckCircle2, XCircle } from 'lucide-react';
import type { CheckResult } from '../types';

interface ResultCardProps {
  result: CheckResult | null;
}

export function ResultCard({ result }: ResultCardProps) {
  if (!result) return null;

  if (result.available) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 animate-[fadeIn_0.2s_ease-out]">
        <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800">Available</p>
          <p className="text-sm text-emerald-700 mt-0.5">
            This time slot is free. You can proceed with booking it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 animate-[fadeIn_0.2s_ease-out]">
      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-red-800">Unavailable</p>
        <p className="text-sm text-red-700 mt-0.5">{result.reason}</p>
      </div>
    </div>
  );
}
