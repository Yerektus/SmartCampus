import { Clock, CalendarClock } from 'lucide-react';

interface NumberFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint: string;
  icon: typeof Clock;
  max: number;
}

function NumberField({ label, value, onChange, hint, icon: Icon, max }: NumberFieldProps) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-1.5">
        <Icon className="w-4 h-4 text-slate-400" />
        {label}
      </label>
      <input
        type="number"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
        placeholder="0–1440"
      />
      <p className="text-xs text-slate-400 mt-1">{hint}</p>
    </div>
  );
}

interface TimeInputsProps {
  currentTime: string;
  startTime: string;
  endTime: string;
  onCurrentTimeChange: (v: string) => void;
  onStartTimeChange: (v: string) => void;
  onEndTimeChange: (v: string) => void;
  dayEnd: number;
}

export function TimeInputs({
  currentTime,
  startTime,
  endTime,
  onCurrentTimeChange,
  onStartTimeChange,
  onEndTimeChange,
  dayEnd,
}: TimeInputsProps) {
  const hint = `Minutes since midnight (0–${dayEnd})`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <NumberField
        label="Current time"
        value={currentTime}
        onChange={onCurrentTimeChange}
        hint={hint}
        icon={Clock}
        max={dayEnd}
      />
      <NumberField
        label="Start"
        value={startTime}
        onChange={onStartTimeChange}
        hint={hint}
        icon={CalendarClock}
        max={dayEnd}
      />
      <NumberField
        label="End"
        value={endTime}
        onChange={onEndTimeChange}
        hint={hint}
        icon={CalendarClock}
        max={dayEnd}
      />
    </div>
  );
}
