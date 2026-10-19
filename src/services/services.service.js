import servicesRepository from '../repositories/services.repository.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

const FIELDS = ['name', 'description', 'duration', 'price', 'category', 'available'];

const isMissing = (value) =>
  value === undefined || value === null || (typeof value === 'string' && value.trim() === '');

const pickFields = (data) =>
  Object.fromEntries(
    FIELDS.filter((field) => data[field] !== undefined).map((field) => [field, data[field]])
  );

export class ServicesService {
  constructor(repository) {
    this.repository = repository;
  }

  async getServices(filters = {}) {
    const { category, available } = filters;
    const services = await this.repository.getAll();

    return services.filter((service) => {
      if (category !== undefined && String(service.category).toLowerCase() !== category.toLowerCase()) {
        return false;
      }
      if (available !== undefined && service.available !== available) {
        return false;
      }
      return true;
    });
  }

  async getServiceById(id) {
    const service = await this.repository.getById(id);
    if (!service) throw new NotFoundError(`No existe un servicio con id ${id}`);
    return service;
  }

  async createService(serviceData) {
    const data = pickFields(serviceData ?? {});
    const missing = FIELDS.filter((field) => isMissing(data[field]));

    if (missing.length > 0) {
      throw new ValidationError(`Servicio incompleto. Faltan los campos: ${missing.join(', ')}`);
    }

    return this.repository.create(data);
  }

  async updateService(id, updatedData) {
    await this.getServiceById(id);

    const changes = pickFields(updatedData ?? {});
    const fields = Object.keys(changes);

    if (fields.length === 0) {
      throw new ValidationError(`No se enviaron campos para actualizar. Campos permitidos: ${FIELDS.join(', ')}`);
    }

    const empty = fields.filter((field) => isMissing(changes[field]));

    if (empty.length > 0) {
      throw new ValidationError(`Los campos no pueden estar vacíos: ${empty.join(', ')}`);
    }

    return this.repository.update(id, changes);
  }

  async deleteService(id) {
    const deleted = await this.repository.delete(id);
    if (!deleted) throw new NotFoundError(`No existe un servicio con id ${id}`);
    return deleted;
  }
}

export default new ServicesService(servicesRepository);
