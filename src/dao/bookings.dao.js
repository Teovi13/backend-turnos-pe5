import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { readJsonArray, writeJsonArray } from './jsonFile.js';

const DEFAULT_PATH = fileURLToPath(new URL('../data/bookings.json', import.meta.url));

export default class BookingsDAO {
  constructor(filePath = DEFAULT_PATH) {
    this.filePath = filePath;
  }

  async create(data) {
    const bookings = await readJsonArray(this.filePath);
    const newBooking = { id: randomUUID(), ...data };

    bookings.push(newBooking);
    await writeJsonArray(this.filePath, bookings);

    return newBooking;
  }

  async getById(id) {
    const bookings = await readJsonArray(this.filePath);
    return bookings.find((booking) => booking.id === id) ?? null;
  }

  async update(id, data) {
    const bookings = await readJsonArray(this.filePath);
    const index = bookings.findIndex((booking) => booking.id === id);

    if (index === -1) return null;

    bookings[index] = { ...bookings[index], ...data, id };
    await writeJsonArray(this.filePath, bookings);

    return bookings[index];
  }
}
