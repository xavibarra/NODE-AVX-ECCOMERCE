import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import { convertKeysToCamelCase } from "./lib/utils";
import { Router } from 'express';
import { searchComponents } from './controllers/searchController';

dotenv.config();
const app: Express = express();

// Middleware para permitir CORS
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Middleware personalizado para convertir las claves de las solicitudes en formato camelCase
app.use(convertKeysToCamelCase);

// Definición del puerto de escucha del servidor
const port = process.env.PORT || 3000;

// Importación de las rutas
const categoryRoutes = require("./routes/categories");
const productsRoutes = require("./routes/products");
const valuesRoutes = require("./routes/values");

// Rutas para manejar las peticiones relacionadas
app.use("/categories", categoryRoutes);
app.use("/products", productsRoutes);
app.use("/values", valuesRoutes);

// Definir y usar las rutas adicionales
const router = Router();

// Define la ruta GET para buscar componentes
router.get('/search', searchComponents);

// Usar el enrutador para las rutas adicionales
app.use('/api', router);

// Inicio del servidor, escuchando en el puerto especificado
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port} 🚀`);
});

