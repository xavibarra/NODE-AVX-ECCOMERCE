import { Request, Response } from "express";
const Service = require("../services/values");

// Definición de la función para encontrar todos los valores.
exports.findAll = function (req: Request, res: Response) {
  return Service.findAll(res);
};

// Definición de la función para encontrar un valor por su ID.
exports.findById = function (req: Request, res: Response) {
  return Service.findById(req, res);
};

// Definición de la función para encontrar un valor por productID.
exports.findByProductId = function (req: Request, res: Response) {
  return Service.findByProductId(req, res);
};

// Definición de la función para encontrar un valor por featureID.
exports.findByFeatureId = function (req: Request, res: Response) {
  return Service.findByFeatureId(req, res);
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
  const id = req.params.valuesId;
  return Service.delete(id, res);
};

// Definición de la función para eliminar un producto por PRODUCT_ID.
exports.deleteByProductId = function (req: Request, res: Response) {
  const productId = req.params.productId;
  return Service.deleteByProductId(productId, res);
};

// Definición de la función para actualizar un producto por su ID.
exports.update = function (req: Request, res: Response) {
  const id = req.params.valuesId;
  const updatedValue = req.body;
  return Service.update(id, updatedValue, res);
};

// Definición de la función para actualizar un producto por PRODUCT_ID.
exports.updateByProductId = function (req: Request, res: Response) {
  const productId = req.params.productId;
  const updatedValues = req.body;

  try {
    updatedValues.forEach(async (value: any) => {
      const { id, id_feature, value: updatedValue } = value;
      await Service.update(
        id,
        { id_product: productId, id_feature, value: updatedValue },
        res
      );
    });

    res.send({ message: "Values updated successfully" });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};

// Función para obtener los valores de características por ID de producto.
exports.getFeatureValues = async (req: Request, res: Response) => {
  const { productId } = req.params;
  try {
    const featureValues = await Service.getFeatureValuesByProductId(
      Number(productId)
    );
    res.status(200).json(featureValues);
  } catch (error) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};


exports.findFeatureValuesByCategory = async function (req: Request, res: Response) {
  const { categoryId } = req.params;
  try {
    const featureValues = await Service.getFeatureValuesByCategoryId(
      Number(categoryId)
    );
    res.status(200).json(featureValues);
  } catch (error) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};