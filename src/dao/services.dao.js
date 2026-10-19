import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { readJsonArray, writeJsonArray } from './jsonFile.js';

const DEFAULT_PATH = fileURLToPath(new URL('../data/services.json', import.meta.url));

export default class ServicesDAO {
  constructor(filePath = DEFAULT_PATH) {
    this.filePath = filePath;
  }

  async getAll() {
    return readJsonArray(this.filePath);
  }

  async getById(id) {
    const services = await readJsonArray(this.filePath);
    return services.find((service) => service.id === id) ?? null;
  }

  async create(data) {
    const services = await readJsonArray(this.filePath);
    const newService = { id: randomUUID(), ...data };

    services.push(newService);
    await writeJsonArray(this.filePath, services);

    return newService;
  }

  async update(id, data) {
    const services = await readJsonArray(this.filePath);
    const index = services.findIndex((service) => service.id === id);

    if (index === -1) return null;

    services[index] = { ...services[index], ...data, id };
    await writeJsonArray(this.filePath, services);

    return services[index];
  }

  async delete(id) {
    const services = await readJsonArray(this.filePath);
    const index = services.findIndex((service) => service.id === id);

    if (index === -1) return null;

    const [deleted] = services.splice(index, 1);
    await writeJsonArray(this.filePath, services);

    return deleted;
  }
}
