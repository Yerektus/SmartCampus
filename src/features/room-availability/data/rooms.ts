import type { Room } from '../types';

export const ROOMS: Room[] = [
  {
    id: 'A',
    name: 'Room A',
    blocked: false,
    bookings: [
      { start: 600, end: 660 },
      { start: 900, end: 960 },
    ],
  },
  {
    id: 'B',
    name: 'Room B',
    blocked: true,
    bookings: [],
  },
  {
    id: 'C',
    name: 'Room C',
    blocked: false,
    bookings: [],
  },
];

export const DAY_END = 1440;
export const MAX_DURATION = 120;
