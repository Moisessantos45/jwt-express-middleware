# JWT Middleware Library

Una biblioteca de middleware para proteger rutas usando JSON Web Tokens (JWT) en Express.js, escrita en TypeScript.

## Instalación

```console
npm install jwt-express-middleware
```

# Uso
# Configuración por Defecto

```js
import express from 'express';
import { jwtMiddleware, extractToken, generateToken } from 'tu-biblioteca-jwt';

const app = express();
const secretKey = 'your-secret-key';

## Generar un token con los valores predeterminados
const token = generateToken({ userId: '12345', role: 'admin' }, secretKey);
console.log('Generated Token:', token);

### Usar el middleware con la configuración por defecto
app.use(jwtMiddleware(secretKey));

app.get('/protected', (req, res) => {
  res.send(`Hello protected route, user ID: ${(req as any).user.userId}`);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

# Configuración Personalizada
```js
import express from 'express';
import { jwtMiddleware, extractToken, generateToken } from 'tu-biblioteca-jwt';

const app = express();
const secretKey = 'your-secret-key';

## Generar un token con un tiempo de expiración personalizado
const token = generateToken(
  { userId: '12345', role: 'admin' },
  secretKey,
  { expiresIn: '2h' }
);
console.log('Generated Token:', token);
```

## Usar el middleware con opciones personalizadas
```js
app.use(jwtMiddleware(secretKey, {
  message: {
    errorMessage: 'Custom invalid token message',
    successMessage: 'Custom success message',
  },
  algorithms: ['HS256', 'RS256']
}));

app.get('/protected', (req, res) => {
  res.send(`Hello protected route, user ID: ${(req as any).user.userId}`);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Ejemplo de Uso con un Router de Rutas

```typescript
import { Router } from "express";
import {
  deleteProyect,
  getProyects,
  postProyects,
  updateProyect,
  getByIdProyect
} from "../Controllers/ControllerProyects";
import { jwtMiddleware, generateToken } from 'jwt-express-middleware';

const router = Router();
const secretKey = 'your-secret-key';

// Ejemplo de generar un token (esto debería hacerse en tu lógica de autenticación y no aquí)
const token = generateToken({ userId: '12345', role: 'admin' }, secretKey);
console.log('Generated Token:', token);

// Proteger todas las rutas con el middleware JWT
router.use(jwtMiddleware(secretKey));

// Rutas
router.get("/", getProyects);
router.get("/:id", getByIdProyect);
router.post("/post", postProyects);
router.put("/update/:id", updateProyect);
router.delete("/delete/:id", deleteProyect);

// Proteger rutas individuales

// Rutas
router.get("/", getProyects);
router.get("/:id", jwtMiddleware(secretKey), getByIdProyect);
router.post("/post", jwtMiddleware(secretKey), postProyects);
router.put("/update/:id", jwtMiddleware(secretKey), updateProyect);
router.delete("/delete/:id", jwtMiddleware(secretKey), deleteProyect);

export default router;
````

# API
## jwtMiddleware
Middleware para proteger rutas usando JWT.

jwtMiddleware(secretKey: string, options?: JwtMiddlewareOptions)

secretKey: Clave secreta para verificar el token.
options: Opciones de configuración para el middleware.
Opciones
message: Mensajes personalizados para las respuestas del middleware.
successMessage: Mensaje enviado cuando el token es válido. (Predeterminado: "Token is valid")
errorMessage: Mensaje enviado cuando el token es inválido. (Predeterminado: "Invalid token")
expiresIn: Tiempo de expiración del token. (Predeterminado: "1h")
algorithms: Algoritmos permitidos para la verificación del token. (Predeterminado: ["HS256"])

generateToken
Función para generar un token JWT.

generateToken(payload: JwtPayload, secretKey: string, options?: JwtMiddlewareOptions): string

payload: Datos a incluir en el token.
secretKey: Clave secreta para firmar el token.
options: Opciones de configuración para la generación del token.


extractToken
Función para extraer el token JWT del encabezado de la solicitud.

extractToken(req: Request): string

req: Objeto de solicitud de Express.


## Screenshots

![App Screenshot](https://i.ibb.co/PjWgdBF/code-jwt-1.png)

![App Screenshot](https://i.ibb.co/XpfxyKW/code-jwt-2.png)
![App Screenshot](https://i.ibb.co/PFYn1vx/code-jwt-3.png)
![App Screenshot](https://i.ibb.co/jwHDLHq/code-jwt-4.png)
