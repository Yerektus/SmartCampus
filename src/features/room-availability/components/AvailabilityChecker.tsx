import { useState } from 'react';
import { DoorClosed, Clock, CalendarClock, CheckCircle2, XCircle } from 'lucide-react';
import { checkAvailability } from '@/availability';

const FIXED_NOW = new Date('2026-11-02T08:00:00');
const DATE_STR = '2026-11-02';
const DEFAULT_BOOKINGS = [
  { start: `${DATE_STR}T10:00:00`, end: `${DATE_STR}T11:00:00` },
  { start: `${DATE_STR}T14:00:00`, end: `${DATE_STR}T15:00:00` },
];

function toDateTimeString(timeStr: string): string {
  return `${DATE_STR}T${timeStr}:00`;
}

function TimeField({
  label,
  value,
  onChange,
  icon: Icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon: typeof Clock;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-1.5">
        <Icon className="w-4 h-4 text-slate-400" />
        {label}
      </label>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
      />
    </div>
  );
}

export function AvailabilityChecker() {
  const [blocked, setBlocked] = useState(false);
  const [startStr, setStartStr] = useState('11:00');
  const [endStr, setEndStr] = useState('12:00');
  const [result, setResult] = useState<'Available' | 'Unavailable' | null>(null);

  function handleCheck() {
    const room = { id: 'A-101', blocked };
    const request = {
      start: toDateTimeString(startStr),
      end: toDateTimeString(endStr),
    };
    setResult(checkAvailability(room, DEFAULT_BOOKINGS, request, FIXED_NOW));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center">
              <DoorClosed className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Room Availability Checker</h1>
          </div>
          <p className="text-sm text-slate-500 ml-13">
            Check whether room A-101 is free for your desired time slot on 2026-11-02.
          </p>
        </header>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-7 space-y-5">
          {/* Room info */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-1.5">
              <DoorClosed className="w-4 h-4 text-slate-400" />
              Room
            </label>
            <div className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700">
              A-101
            </div>
          </div>

          {/* Blocked checkbox */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={blocked}
                onChange={(e) => setBlocked(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              Room blocked
            </label>
          </div>

          {/* Existing bookings info */}
          <div className="rounded-lg bg-slate-50 px-4 py-3 space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Existing bookings — 2026-11-02</p>
            <p className="text-sm text-slate-600">10:00 – 11:00</p>
            <p className="text-sm text-slate-600">14:00 – 15:00</p>
          </div>

          {/* Time inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TimeField
              label="Start time"
              value={startStr}
              onChange={setStartStr}
              icon={CalendarClock}
            />
            <TimeField
              label="End time"
              value={endStr}
              onChange={setEndStr}
              icon={CalendarClock}
            />
          </div>

          {/* Current time info */}
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
            <Clock className="w-3 h-3" />
            <span>Current time (fixed): <strong className="text-slate-600">2026-11-02 08:00</strong></span>
          </div>

          {/* Check button */}
          <button
            onClick={handleCheck}
            className="w-full rounded-xl bg-sky-600 text-white font-semibold py-3 text-sm hover:bg-sky-700 active:bg-sky-800 transition focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            Check availability
          </button>

          {/* Result */}
          {result && (
            <div
              className={`flex items-start gap-3 rounded-xl border p-4 animate-[fadeIn_0.2s_ease-out] ${
                result === 'Available'
                  ? 'border-emerald-200 bg-emerald-50'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              {result === 'Available' ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p
                  className={`font-semibold ${
                    result === 'Available' ? 'text-emerald-800' : 'text-red-800'
                  }`}
                >
                  {result}
                </p>
                <p
                  className={`text-sm mt-0.5 ${
                    result === 'Available' ? 'text-emerald-700' : 'text-red-700'
                  }`}
                >
                  {result === 'Available'
                    ? 'This time slot is free. You can proceed with booking it.'
                    : 'This time slot is not available.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Reference */}
        <div className="mt-6 text-xs text-slate-400 space-y-1">
          <p>Max booking duration: 120 minutes.</p>
          <p>This tool only checks availability — it does not save a booking.</p>
        </div>
      </div>

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
