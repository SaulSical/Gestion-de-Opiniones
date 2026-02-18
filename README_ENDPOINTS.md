# AuthService - Endpoints y Postman

Base URL: `http://localhost:3005/api/v1`

## Postman: configuracion rapida

1) Crea una coleccion llamada "AuthService".
2) Crea un environment local con:

```
base_url = http://localhost:3005
token =
```

---

## Autenticacion

### 1) Register

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

### 2) Login

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

### 3) Verify Email

Metodo: `POST`
URL: `{{base_url}}/api/v1/auth/verify-email`
Headers:
- `Content-Type: application/json`
Body (raw JSON):

```json
{
  "token": "VERIFICATION_TOKEN_AQUI"
}
```

### 4) Resend Verification

Metodo: `POST`
URL: `{{base_url}}/api/v1/auth/resend-verification`
Headers:
- `Content-Type: application/json`
Body (raw JSON):

```json
{
  "email": "usuario@correo.com"
}
```

### 5) Forgot Password

Metodo: `POST`
URL: `{{base_url}}/api/v1/auth/forgot-password`
Headers:
- `Content-Type: application/json`
Body (raw JSON):

```json
{
  "email": "usuario@correo.com"
}
```

### 6) Reset Password

Metodo: `POST`
URL: `{{base_url}}/api/v1/auth/reset-password`
Headers:
- `Content-Type: application/json`
Body (raw JSON):

```json
{
  "token": "RESET_TOKEN_AQUI",
  "newPassword": "NuevaPassword123"
}
```

---

## Usuarios

### 7) Get Profile (me)

Metodo: `GET`
URL: `{{base_url}}/api/v1/users/profile/me`
Headers:
- `Authorization: Bearer {{token}}`

### 8) Update Profile (me)

Metodo: `PUT`
URL: `{{base_url}}/api/v1/users/profile/me`
Headers:
- `Content-Type: application/json`
- `Authorization: Bearer {{token}}`
Body (raw JSON) - ejemplo basico:

```json
{
  "name": "NuevoNombre",
  "surname": "NuevoApellido",
  "phone": "12345678"
}
```

### 9) Get User Roles

Metodo: `GET`
URL: `{{base_url}}/api/v1/users/{{userId}}/roles`
Headers:
- `Authorization: Bearer {{token}}`

### 10) Get Users By Role

Metodo: `GET`
URL: `{{base_url}}/api/v1/users/by-role/{{roleName}}`
Headers:
- `Authorization: Bearer {{token}}`

---

## Opiniones (MongoDB)

### 11) Crear Opinion

Metodo: `POST`
URL: `{{base_url}}/api/v1/opinions`
Headers:
- `Content-Type: application/json`
- `Authorization: Bearer {{token}}`
Body (raw JSON):

```json
{
  "title": "Mi opinion sobre tecnologia",
  "category": "Tecnologia",
  "content": "Creo que la tecnologia ha cambiado nuestras vidas..."
}
```

### 12) Obtener Opiniones

Metodo: `GET`
URL: `{{base_url}}/api/v1/opinions?page=1&limit=10`
Query params opcionales:
- `page` (numero de pagina)
- `limit` (cantidad por pagina)
- `category` (filtrar por categoria)
- `authorId` (filtrar por autor)

### 13) Obtener Opinion por ID

Metodo: `GET`
URL: `{{base_url}}/api/v1/opinions/{{opinionId}}`

### 14) Actualizar Opinion (solo autor)

Metodo: `PUT`
URL: `{{base_url}}/api/v1/opinions/{{opinionId}}`
Headers:
- `Content-Type: application/json`
- `Authorization: Bearer {{token}}`
Body (raw JSON):

```json
{
  "title": "Titulo actualizado",
  "category": "Nueva categoria",
  "content": "Contenido actualizado..."
}
```

### 15) Eliminar Opinion (solo autor)

Metodo: `DELETE`
URL: `{{base_url}}/api/v1/opinions/{{opinionId}}`
Headers:
- `Authorization: Bearer {{token}}`

---

## Comentarios (MongoDB)

### 16) Crear Comentario

Metodo: `POST`
URL: `{{base_url}}/api/v1/comments`
Headers:
- `Content-Type: application/json`
- `Authorization: Bearer {{token}}`
Body (raw JSON):

```json
{
  "opinionId": "OPINION_ID_AQUI",
  "content": "Estoy de acuerdo con tu opinion..."
}
```

### 17) Obtener Comentarios de una Opinion

Metodo: `GET`
URL: `{{base_url}}/api/v1/comments/opinion/{{opinionId}}?page=1&limit=20`
Query params opcionales:
- `page` (numero de pagina)
- `limit` (cantidad por pagina)

### 18) Obtener Comentario por ID

Metodo: `GET`
URL: `{{base_url}}/api/v1/comments/{{commentId}}`

### 19) Actualizar Comentario (solo autor)

Metodo: `PUT`
URL: `{{base_url}}/api/v1/comments/{{commentId}}`
Headers:
- `Content-Type: application/json`
- `Authorization: Bearer {{token}}`
Body (raw JSON):

```json
{
  "content": "Comentario actualizado..."
}
```

### 20) Eliminar Comentario (solo autor)

Metodo: `DELETE`
URL: `{{base_url}}/api/v1/comments/{{commentId}}`
Headers:
- `Authorization: Bearer {{token}}`

---

## Notas importantes

- Las opiniones y comentarios se almacenan en **MongoDB**.
- Los usuarios se autentican con **PostgreSQL** (JWT).
- Solo el **autor** puede editar o eliminar sus propias opiniones/comentarios.
- Las eliminaciones son **soft delete** (marcan `isActive: false`).
- Todos los endpoints de opiniones/comentarios requieren token JWT valido (excepto GET publicos).
