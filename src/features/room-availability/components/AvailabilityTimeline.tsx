import { useMemo } from 'react';
import type { Room } from '../types';
import { DAY_END } from '../data/rooms';
import { formatMinutes } from '@/shared/utils/formatMinutes';

interface AvailabilityTimelineProps {
  room: Room | undefined;
  candidateStart: number | null;
  candidateEnd: number | null;
}

const HOUR_MARKS = Array.from({ length: 25 }, (_, i) => i * 60);
const AXIS_HOURS_3 = [0, 3, 6, 9, 12, 15, 18, 21, 24];
const AXIS_HOURS_6 = [0, 6, 12, 18, 24];

export function AvailabilityTimeline({ room, candidateStart, candidateEnd }: AvailabilityTimelineProps) {
  const pct = (m: number) => (m / DAY_END) * 100;

  const candidate = useMemo(() => {
    if (
      candidateStart == null || candidateEnd == null ||
      candidateStart < 0 || candidateEnd > DAY_END ||
      candidateStart >= candidateEnd
    ) {
      return null;
    }
    return { start: candidateStart, end: candidateEnd };
  }, [candidateStart, candidateEnd]);

  const renderAxisLabel = (h: number) => (
    <span
      key={h}
      className="absolute text-sm text-slate-600 font-medium"
      style={{
        left: h === 0 ? '0' : h === 24 ? 'auto' : `${pct(h * 60)}%`,
        right: h === 24 ? '0' : 'auto',
        transform: h === 0 || h === 24 ? 'none' : 'translateX(-50%)',
      }}
    >
      {formatMinutes(h * 60)}
    </span>
  );

  return (
    <div className="w-full overflow-hidden">
      {/* Timeline bar — taller with higher-contrast grid */}
      <div className="relative h-24 w-full rounded-lg bg-slate-200 border-2 border-slate-300 overflow-hidden">
        {/* hour gridlines — darker for visibility */}
        {HOUR_MARKS.map((m) => (
          <div
            key={m}
            className="absolute top-0 bottom-0 border-l border-slate-300"
            style={{ left: `${pct(m)}%` }}
          />
        ))}

        {/* existing bookings — solid blue, no text inside */}
        {room?.bookings.map((b, i) => (
          <div
            key={i}
            className="absolute top-1.5 bottom-1.5 rounded bg-sky-600"
            style={{
              left: `${pct(b.start)}%`,
              width: `${pct(b.end - b.start)}%`,
            }}
          />
        ))}

        {/* blocked overlay */}
        {room?.blocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-500/25">
            <span className="text-base font-semibold text-red-700">Blocked</span>
          </div>
        )}

        {/* candidate interval — amber dashed border, no text inside */}
        {candidate && (
          <div
            className="absolute top-1.5 bottom-1.5 rounded border-2 border-dashed border-amber-600 bg-amber-400/60"
            style={{
              left: `${pct(candidate.start)}%`,
              width: `${pct(candidate.end - candidate.start)}%`,
            }}
          />
        )}
      </div>

      {/* axis labels — every 3h on desktop, every 6h on mobile */}
      <div className="relative h-6 mt-1 hidden sm:block">
        {AXIS_HOURS_3.map(renderAxisLabel)}
      </div>
      <div className="relative h-6 mt-1 sm:hidden">
        {AXIS_HOURS_6.map(renderAxisLabel)}
      </div>

      {/* time-range list — full labels, never truncated */}
      <div className="mt-2 space-y-1">
        {room && !room.blocked && room.bookings.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-slate-600">
            {room.bookings.map((b, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-sm bg-sky-600 flex-shrink-0" />
                {formatMinutes(b.start)}–{formatMinutes(b.end)}
              </span>
            ))}
          </div>
        )}
        {candidate && (
          <div className="text-sm text-slate-600 flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm border-2 border-dashed border-amber-600 bg-amber-400/60 flex-shrink-0" />
            {formatMinutes(candidate.start)}–{formatMinutes(candidate.end)}
          </div>
        )}
      </div>

      {/* legend — wraps on narrow screens */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-slate-600">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-4 rounded bg-sky-600" />
          Existing booking
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-4 rounded border-2 border-dashed border-amber-600 bg-amber-400/60" />
          Requested interval
        </span>
      </div>
    </div>
  );
}
