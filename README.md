# Backend de Turnos y Reservas - Pre-entrega 5

API REST de servicios y reservas refactorizada con arquitectura en capas: routes, controllers, services, repositories y DAO. La persistencia sigue siendo en archivos JSON y los endpoints no cambiaron.

## Instalación y ejecución

```bash
git clone https://github.com/Teovi13/backend-turnos-pe5.git
cd backend-turnos-pe5
npm install
cp .env.example .env
npm start
```

El servidor queda en `http://localhost:8080`.

## Variables de entorno

| Variable   | Ejemplo       |
| ---------- | ------------- |
| `PORT`     | `8080`        |
| `NODE_ENV` | `development` |

## Arquitectura en capas

```
router → controller → service → repository → DAO → archivo JSON
```

| Capa       | Carpeta         | Responsabilidad                                                                     |
| ---------- | --------------- | ----------------------------------------------------------------------------------- |
| Router     | `routes/`       | Define los endpoints y los conecta con el controller                                |
| Controller | `controllers/`  | Lee `req`, llama al service y responde con `res`                                    |
| Service    | `services/`     | Reglas de negocio: validaciones, valores por defecto, existencia de recursos, `quantity`. No conoce `req`/`res` |
| Repository | `repositories/` | Métodos de acceso a datos para los services; delega en el DAO                       |
| DAO        | `dao/`          | Lee y escribe los archivos JSON y genera los ids. Sin lógica de negocio             |

Cada capa recibe la inferior por el constructor (inyección de dependencias), así que el service solo conoce al repository y nunca al DAO. Para migrar a MongoDB alcanza con reemplazar el DAO.

| Recurso  | Controller y Service                                                           | Repository y DAO                                  |
| -------- | ------------------------------------------------------------------------------ | ------------------------------------------------- |
| services | `getServices`, `getServiceById`, `createService`, `updateService`, `deleteService` | `getAll`, `getById`, `create`, `update`, `delete` |
| bookings | `createBooking`, `getBookingById`, `addServiceToBooking`                       | `create`, `getById`, `update`                     |

La regla de incrementar `quantity` cuando se agrega dos veces el mismo servicio está en `bookings.service.js`.

Los services lanzan `ValidationError` (400) o `NotFoundError` (404), que el middleware de errores de `app.js` convierte en la respuesta HTTP.

## Endpoints

| Método | Ruta                               | Descripción                         | Códigos       |
| ------ | ---------------------------------- | ----------------------------------- | ------------- |
| GET    | `/api/services`                    | Lista servicios (`?category=`, `?available=`) | 200, 400 |
| GET    | `/api/services/:sid`               | Obtiene un servicio                 | 200, 404      |
| POST   | `/api/services`                    | Crea un servicio                    | 201, 400      |
| PUT    | `/api/services/:sid`               | Actualiza un servicio               | 200, 400, 404 |
| DELETE | `/api/services/:sid`               | Elimina un servicio                 | 200, 404      |
| POST   | `/api/bookings`                    | Crea una reserva                    | 201, 400      |
| GET    | `/api/bookings/:bid`               | Obtiene una reserva                 | 200, 404      |
| POST   | `/api/bookings/:bid/services/:sid` | Agrega un servicio a una reserva    | 200, 400, 404 |

## Ejemplo

```bash
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"clientName":"Ana Pérez","clientEmail":"ana@mail.com","date":"2026-11-05","time":"10:30"}'

curl -X POST http://localhost:8080/api/bookings/<bid>/services/4971a0ab-8dcf-42a8-a230-38db8e38e674
```
