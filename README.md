 # AuthService

Este repositorio contiene el servicio de autenticación y gestión de perfiles para el proyecto "Gestión de Opiniones". Está hecho con Node.js, Express y PostgreSQL; incluye registro, login (por email o usuario), verificación de email, recuperación de contraseña y gestión básica de perfiles y roles.

Contenido rápido:
- Resumen ejecutivo
- Cómo instalar y ejecutar (local y Docker)
- Variables de entorno necesarias
- Uso rápido (endpoints principales)
- Pruebas con Postman
- Registro de cambios y verificación

Si solo quieres empezar rápido, sigue la sección "Instalación rápida".

## Resumen ejecutivo

AuthService está listo para pruebas. Implementa:
- Registro de usuarios con verificación por email
- Login por email o nombre de usuario, devuelve JWT
- Obtener/actualizar perfil del usuario autenticado
- Cambio de contraseña (requiere contraseña actual)
- Recuperación y reseteo de contraseña por token
- Control de roles básico (ADMIN_ROLE / USER_ROLE)
- Seguridad: Argon2 para contraseñas, JWT, rate limiting, Helmet y validaciones

## Instalación rápida (local)

1) Clona y entra al repo:

```bash
git clone <url-del-repositorio>
cd AuthService
```

2) Instala dependencias:

```bash
npm install
```

3) Crea la base de datos PostgreSQL (ejemplo):

```sql
CREATE DATABASE gestion_opiniones;
```

4) Copia `.env.example` a `.env` y añade tus credenciales (ver sección siguiente).

5) Levanta la app en modo desarrollo:

```bash
npm run dev
```

La API quedará por defecto en `http://localhost:3005`.

## Instalación con Docker (rápido)

Si prefieres usar Docker, hay un `docker-compose.yml` que levanta PostgreSQL y pgAdmin.

```bash
cd AuthService
docker-compose up -d
```

Luego verifica con `docker-compose ps` y sigue las instrucciones de `DOCKER_SETUP.md` para conectar pgAdmin.

## Variables de entorno (mínimas)

Asegúrate de definir al menos estas variables en `.env`:

- `PORT` (ej. 3005)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`
- `JWT_SECRET`, `JWT_EXPIRY`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (si usas Cloudinary)
- `BASE_URL` (ej. http://localhost:3005)

Para ejemplos completos y valores recomendados mira `DOCKER_SETUP.md` y `ENDPOINTS.md`.

## Endpoints

Base URL: `http://localhost:3005/api/v1`

Autenticacion:
- POST `/auth/register` (multipart/form-data)
- POST `/auth/login` (JSON)
- POST `/auth/verify-email` (JSON)
- POST `/auth/resend-verification` (JSON)
- POST `/auth/forgot-password` (JSON)
- POST `/auth/reset-password` (JSON)

Usuarios:
- GET `/users/profile/me` (Bearer token)
- PUT `/users/profile/me` (Bearer token, JSON)
- GET `/users/:userId/roles` (Bearer token)
- GET `/users/by-role/:roleName` (Bearer token)

## Formato de respuesta

Todas las respuestas siguen el formato:

```json
{
  "success": true|false,
  "message": "texto descriptivo",
  "data": { /* opcional */ }
}
```

Los errores incluyen mensajes y, cuando aplica, detalles de validación.

## Postman (ejemplos dentro del README)

1) Crea una coleccion llamada "AuthService".
2) Crea un environment local con:

```
base_url = http://localhost:3005
token =
```

### Ejemplo 1: Register (multipart/form-data)

Metodo: `POST`
URL: `{{base_url}}/api/v1/auth/register`
Body: `form-data`

Campos:
- `name` (Text)
- `surname` (Text)
- `username` (Text)
- `email` (Text)
- `password` (Text)
- `phone` (Text)
- `profilePicture` (File, opcional)

### Ejemplo 2: Login (JSON)

Metodo: `POST`
URL: `{{base_url}}/api/v1/auth/login`
Headers:
- `Content-Type: application/json`
Body (raw JSON):

```json
{
  "emailOrUsername": "usuario@correo.com",
  "password": "TuPassword123"
}
```

Guarda el token del response en el environment (key `token`).

### Ejemplo 3: Perfil (Bearer)

Metodo: `GET`
URL: `{{base_url}}/api/v1/users/profile/me`
Headers:
- `Authorization: Bearer {{token}}`

## Cambios recientes

Resumen breve (ver `CAMBIOS.md` para detalles):

- Nuevas rutas de perfil: `GET /users/profile/me`, `PUT /users/profile/me`.
- Helpers para actualización de perfil y validación de username único.
- Encriptación con Argon2 y validación de contraseña anterior.

## Verificación y checklist

El proyecto ya pasó la verificación básica: endpoints implementados, validaciones, seguridad y documentación. Para la lista completa de verificación consulta `VERIFICACION.md`.

## Estructura del repositorio

```
AuthService/
├── configs/
├── helpers/
├── middlewares/
├── src/
│   ├── auth/
│   └── users/
├── uploads/
├── utils/
├── README.md
├── ENDPOINTS.md
├── CAMBIOS.md
└── VERIFICACION.md
```

## Solución de problemas comunes

- "Database connection error": revisa que PostgreSQL esté corriendo y `.env` tenga las credenciales correctas.
- "Token inválido": verifica que el token no haya expirado y que se use el header `Authorization: Bearer {token}`.
- Problemas con puertos Docker: revisa `docker-compose.yml` y los puertos locales.

## Contribuir

Si quieres colaborar:

1. Crea un branch con nombre claro (`feat/...` o `fix/...`).
2. Abre PR describiendo los cambios y pruebas realizadas.
3. Incluye tests si añades lógica crítica.

## Siguientes pasos sugeridos

- Ejecutar pruebas de integración sobre los endpoints críticos.
- Añadir colección de Postman exportada al repo.
- Integrar pipelines CI para lint y tests.

---

Si quieres, puedo:
- generar y añadir una colección de Postman basada en `ENDPOINTS.md`,
- o crear un `README` más corto para uso rápido (deploy),
indica cuál prefieres.

Última actualización: 17 de febrero de 2026
