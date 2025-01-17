import { Request, Response } from "express";
const Service = require("../services/products");

// Definición de la función para encontrar todos los productos.
exports.findAll = function (req: Request, res: Response) {
  return Service.findAll(res);
};

//Función para filtrar los productos en oferta.
exports.offerProducts = function (req: Request, res: Response) {
  return Service.offerProducts(res);
};

// Definición de la función para encontrar un producto por su ID.
exports.findById = function (req: Request, res: Response) {
  return Service.findById(req, res);
};

// Definición de la función para encontrar 10 productos por su categoria.
exports.productsByCategory = function (req: Request, res: Response) {
  return Service.productsByCategory(req, res);
};

// Definición de la función para crear un nuevo producto.
exports.create = function (req: Request, res: Response) {
  return Service.create(req, res);
};

// Definición de la función para crear múltiples productos.
exports.createMultiple = function (req: Request, res: Response) {
  return Service.createMultiple(req, res);
};

// Definición de la función para eliminar un producto por su ID.
exports.delete = function (req: Request, res: Response) {
  const id = req.params.productId;
  return Service.delete(id, res);
};

// Definición de la función para actualizar un producto por su ID.
exports.update = function (req: Request, res: Response) {
  const id = req.params.productId;
  const updatedProduct = req.body;
  return Service.update(id, updatedProduct, res);
};

// Función para buscar productos por nombre.
exports.searchByName = function (req: Request, res: Response) {
  const name = req.params.name; // Extraer el parámetro de nombre de la ruta.
  return Service.searchByName(name, res);
};

// Filtros por precio
exports.searchByPrice = function (req: Request, res: Response) {
  const { minPrice, maxPrice } = req.params;
  return Service.searchByPrice(minPrice, maxPrice, res);
};

// Filtros por precio y nombre
exports.searchByPriceAndName = function (req: Request, res: Response) {
  const { minPrice, maxPrice, name } = req.params;
  return Service.searchByPriceAndName(minPrice, maxPrice, name, res);
};

// Filtros por precio y categoría
exports.searchByPriceAndCategory = function (req: Request, res: Response) {
  const { minPrice, maxPrice, category } = req.params;
  return Service.searchByPriceAndCategory(minPrice, maxPrice, category, res);
};

// Filtros por precio, nombre y categoría
exports.searchByAllFilters = function (req: Request, res: Response) {
  const { minPrice, maxPrice, name, category } = req.params;
  return Service.searchByAllFilters(minPrice, maxPrice, name, category, res);
};