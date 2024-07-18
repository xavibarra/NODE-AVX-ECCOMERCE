import { Router } from "express";
const ControllerValues = require("../controllers/values");
const values = require("express").Router();

//--------------------------------- GET ------------------------------------------//
values.get("/:categoryId", ControllerValues.findFeaturesByCategory);

// Ruta para obtener todos los valores de featuresValues
values.get("/", ControllerValues.findAll);

// Ruta GET para encontrar un featuresValues por su ID.
values.get("/:valuesId", ControllerValues.findById);

// Ruta GET para encontrar un featuresValues por su ID_PRODUCT.
values.get("/product/:productId", ControllerValues.findByProductId);

// Ruta GET para encontrar un featuresValues por su ID_FEATURE.
values.get("/feature/:featureId", ControllerValues.findByFeatureId);

// ÁLVARO
values.get("/features/:productId", ControllerValues.getFeatureValues);

//--------------------------------- POST ------------------------------------------//

// Ruta POST para crear un nuevo featuresValues.
values.post("/", ControllerValues.create);

// Ruta POST para crear múltiples featuresValues.
values.post("/all", ControllerValues.createMultiple);

//--------------------------------- PUT ------------------------------------------//

// Ruta PUT/PATCH para actualizar un featuresValues por su ID.
values.put("/:valuesId", ControllerValues.update);

// Ruta PUT/PATCH para actualizar un featuresValues por PRODUCT_ID.
values.put("/product/:productId", ControllerValues.updateByProductId);

//--------------------------------- DELETE ------------------------------------------//

// Ruta DELETE para eliminar un featuresValues por su ID.
values.delete("/:valuesId", ControllerValues.delete);

// Ruta DELETE para eliminar un featuresValues por PRODUCT_ID.
values.delete("/product/:productId", ControllerValues.deleteByProductId);

//----------------------------- FEATURES/VALUES -----------------------------------//

module.exports = values;

const router = Router();

// Ruta para obtener los valores de características por ID de producto
router.get("/features/:productId", ControllerValues.getFeatureValues);

export default router;
