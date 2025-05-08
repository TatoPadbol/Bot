# Panel de administración con conexión a MongoDB

Este proyecto permite cargar clientes desde un formulario y guardar sus datos en MongoDB Atlas.

## Rutas
- `/` → Landing
- `/admin` → Formulario
- `/api/save-client` → API interna para guardar

## Variable de entorno
En Vercel agregá:
- `MONGODB_URI` → Tu cadena de conexión de Atlas

## Base sugerida
Base de datos: padbol  
Colección: clientes
