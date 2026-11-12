// tests/availability.test.js — run with: npx vitest run
import { describe, it, expect } from 'vitest';
import { checkAvailability } from '../src/availability.js';

const NOW = new Date('2026-11-02T08:00:00'); // fixed clock
const room = () => ({ id: 'A-101', blocked: false });
const bookings = () => [
  { start: '2026-11-02T14:00:00', end: '2026-11-02T15:00:00' },
  { start: '2026-11-02T10:00:00', end: '2026-11-02T11:00:00' },
]; // fresh fixture each time, intentionally NOT sorted

describe('Room availability', () => {
it('TC-01 AC1: rejects start >= end', () => {
const r = { start: '2026-11-02T12:00:00', end: '2026-11-02T12:00:00' };
expect(checkAvailability(room(), bookings(), r, NOW)).toBe('Unavailable');
  });

it('TC-02 AC1: rejects a request in the past', () => {
const r = { start: '2026-11-02T07:00:00', end: '2026-11-02T07:30:00' };
expect(checkAvailability(room(), bookings(), r, NOW)).toBe('Unavailable');
  });

it('TC-03 AC2: allows exactly 120 minutes', () => {
const r = { start: '2026-11-02T16:00:00', end: '2026-11-02T18:00:00' };
expect(checkAvailability(room(), bookings(), r, NOW)).toBe('Available');
  });

it('TC-04 AC2: rejects 121 minutes', () => {
const r = { start: '2026-11-02T16:00:00', end: '2026-11-02T18:01:00' };
expect(checkAvailability(room(), bookings(), r, NOW)).toBe('Unavailable');
  });

it('TC-05 AC3: rejects a blocked room', () => {
const r = { start: '2026-11-02T16:00:00', end: '2026-11-02T17:00:00' };
expect(checkAvailability({ id: 'A-101', blocked: true }, bookings(), r, NOW)).toBe('Unavailable');
  });

it('TC-06 AC4: rejects a real overlap', () => {
const r = { start: '2026-11-02T10:30:00', end: '2026-11-02T11:30:00' };
expect(checkAvailability(room(), bookings(), r, NOW)).toBe('Unavailable');
  });

it('TC-07 AC4 (BUG-A): allows a booking that starts exactly when another ends', () => {
const r = { start: '2026-11-02T11:00:00', end: '2026-11-02T12:00:00' };
expect(checkAvailability(room(), bookings(), r, NOW)).toBe('Available');
  });

it('TC-08 AC4 (BUG-A): allows a booking that ends exactly when another starts', () => {
const r = { start: '2026-11-02T13:00:00', end: '2026-11-02T14:00:00' };
expect(checkAvailability(room(), bookings(), r, NOW)).toBe('Available');
  });

it('TC-09 AC5 (BUG-B): does not modify the bookings array', () => {
const data = bookings();
const snapshot = structuredClone(data);
const r = { start: '2026-11-02T16:00:00', end: '2026-11-02T17:00:00' };
checkAvailability(room(), data, r, NOW);
expect(data).toEqual(snapshot);
  });

it('TC-10 AC1: rejects an invalid end date', () => {
const r = { start: '2026-11-02T10:30:00', end: '' };
expect(checkAvailability(room(), bookings(), r, NOW)).toBe('Unavailable');
  });

it('TC-11 AC4 (RR-01): rejects when a booking has an invalid date', () => {
const r = { start: '2026-11-02T11:00:00', end: '2026-11-02T12:00:00' };
const badBookings = [{ start: 'not-a-date', end: 'not-a-date' }];
expect(checkAvailability(room(), badBookings, r, NOW)).toBe('Unavailable');
  });
});
