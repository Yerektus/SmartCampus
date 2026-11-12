declare module '@/availability' {
  export const MAX_DURATION_MIN: number;

  export type Room = { id: string; blocked: boolean };
  export type Booking = { start: string; end: string };
  export type AvailabilityRequest = { start: string; end: string };
  export type AvailabilityResult = 'Available' | 'Unavailable';

  export function checkAvailability(
    room: Room,
    bookings: Booking[],
    request: AvailabilityRequest,
    now: Date,
  ): AvailabilityResult;
}
