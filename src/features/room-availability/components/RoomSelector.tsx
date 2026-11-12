import { DoorClosed } from 'lucide-react';
import type { Room } from '../types';

interface RoomSelectorProps {
  rooms: Room[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function RoomSelector({ rooms, selectedId, onSelect }: RoomSelectorProps) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-1.5">
        <DoorClosed className="w-4 h-4 text-slate-400" />
        Room
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {rooms.map((r) => (
          <button
            key={r.id}
            onClick={() => onSelect(r.id)}
            className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition text-left ${
              selectedId === r.id
                ? 'border-sky-500 bg-sky-50 text-sky-700 ring-1 ring-sky-500'
                : 'border-slate-300 text-slate-600 hover:border-slate-400'
            }`}
          >
            <span className="flex items-center justify-between">
              {r.name}
              {r.blocked && (
                <span className="text-[10px] font-semibold uppercase tracking-wide text-red-500 bg-red-100 px-1.5 py-0.5 rounded">
                  Blocked
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
