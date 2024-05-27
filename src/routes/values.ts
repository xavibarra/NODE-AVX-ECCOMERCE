const ControllerVaules = require("../controllers/values");
const values = require("express").Router();

//--------------------------------- GET ------------------------------------------//

// Ruta para obtener todos los valores de featuresValues
values.get("/", ControllerVaules.findAll);

// Ruta GET para encontrar un featuresValues por su ID.
values.get("/:valuesId", ControllerVaules.findById);

// Ruta GET para encontrar un featuresValues por su ID_PRODUCT.
values.get("/product/:productId", ControllerVaules.findByProductId);

// Ruta GET para encontrar un featuresValues por su ID_FEATURE.
values.get("/feature/:featureId", ControllerVaules.findByFeatureId);

//--------------------------------- POST ------------------------------------------//

// Ruta POST para crear un nuevo featuresValues.
values.post("/", ControllerVaules.create);

// Ruta POST para crear múltiples featuresValues.
values.post("/all", ControllerVaules.createMultiple);

//--------------------------------- PUT ------------------------------------------//

// Ruta PUT/PATCH para actualizar un featuresValues por su ID.
values.put("/:valuesId", ControllerVaules.update);

// Ruta PUT/PATCH para actualizar un featuresValues por PRODUCT_ID.
values.put("/product/:productId", ControllerVaules.updateByProductId);

//--------------------------------- DELETE ------------------------------------------//

// Ruta DELETE para eliminar un featuresValues por su ID.
values.delete("/:valuesId", ControllerVaules.delete);

// Ruta DELETE para eliminar un featuresValues por PRODUCT_ID.
values.delete("/product/:productId", ControllerVaules.deleteByProductId);

module.exports = values;
