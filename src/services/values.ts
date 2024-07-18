import { createClient } from "@supabase/supabase-js";
import { Request, Response } from "express";
const ControllerVaules = require("../controllers/values");
const values = require("express").Router();

// Configuración de Supabase
const supabaseUrl: string = process.env.SUPABASE_URL || ""; // URL de tu base de datos de Supabase
const supabaseKey: string = process.env.SUPABASE_KEY || ""; // Token de autenticación de tu base de datos de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

const VALUES_TABLE_NAME: string = "features_values";
const FEATURES_TABLE_NAME: string = "features";

// Función para encontrar todos los productos.
exports.findAll = async function (res: Response) {
  try {
    const { data, error } = await supabase.from(VALUES_TABLE_NAME).select("*");

    if (error) {
      throw new Error(error.message);
    }

    res.send(data);
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};

// Función para encontrar un valor por su ID.
exports.findById = async function (req: Request, res: Response) {
  try {
    const id = req.params.valuesId;
    const { data: value, error } = await supabase
      .from(VALUES_TABLE_NAME)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!value) {
      res.status(404).send({ message: "Value not found" });
    } else {
      res.send(value);
    }
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};

// Función para encontrar un valor por PRODUCT_ID.
exports.findByProductId = async function (req: Request, res: Response) {
  try {
    const productId = req.params.productId;
    const { data: value, error } = await supabase
      .from(VALUES_TABLE_NAME)
      .select("*")
      .eq("id_product", productId);

    if (error) {
      throw new Error(error.message);
    }

    if (!value) {
      res.status(404).send({ message: "Value not found" });
    } else {
      res.send(value);
    }
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};

// Función para encontrar un valor por FEATURE_ID.
exports.findByFeatureId = async function (req: Request, res: Response) {
  try {
    const featureId = req.params.featureId;
    const { data: value, error } = await supabase
      .from(VALUES_TABLE_NAME)
      .select("*")
      .eq("id_feature", featureId);

    if (error) {
      throw new Error(error.message);
    }

    if (!value) {
      res.status(404).send({ message: "Value not found" });
    } else {
      res.send(value);
    }
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};

// Función para crear un nuevo VALOR.
exports.create = async function (req: Request, res: Response) {
  try {
    const { id, idProduct, idFeature, value } = req.body;

    const { error } = await supabase.from(VALUES_TABLE_NAME).insert([
      {
        id,
        idProduct,
        idFeature,
        value,
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }

    res.send({ message: "Value created successfully" });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};

// Función para crear múltiples VALORES.
exports.createMultiple = async function (req: Request, res: Response) {
  try {
    const values = req.body;
    const { error } = await supabase.from(VALUES_TABLE_NAME).insert(values);

    if (error) {
      throw new Error(error.message);
    }

    res.send({ message: "Values created successfully" });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};

// Función para eliminar un valor por su ID.
exports.delete = async function (id: string, res: Response) {
  try {
    const { error } = await supabase
      .from(VALUES_TABLE_NAME)
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    res.send({ message: "Value deleted successfully" });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};

// Función para eliminar un valor por PRODUCT_ID.
exports.deleteByProductId = async function (productId: string, res: Response) {
  try {
    const { error } = await supabase
      .from(VALUES_TABLE_NAME)
      .delete()
      .eq("id_product", productId);

    if (error) {
      throw new Error(error.message);
    }

    res.send({ message: "Value deleted successfully" });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};

// Función para actualizar un VALOR por su ID.
exports.update = async function (id: string, updatedValue: any, res: Response) {
  try {
    const { error } = await supabase
      .from(VALUES_TABLE_NAME)
      .update(updatedValue)
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    res.send({ message: "Value updated successfully" });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};

// Función para actualizar un VALOR por su PRODUCT_ID.
exports.updateByProductId = async function (
  productId: string,
  updatedValue: any,
  res: Response
) {
  try {
    const { error } = await supabase
      .from(VALUES_TABLE_NAME)
      .update(updatedValue)
      .eq("id_product", productId);

    if (error) {
      throw new Error(error.message);
    }

    res.send({ message: "Value updated successfully" });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};

// Función para obtener valores de características por ID de producto.
exports.getFeatureValuesByProductId = async function (productId: number) {
  const { data, error } = await supabase.rpc("product_features_query", {
    product_id: productId,
  });

  if (error) {
    console.error("Error fetching feature values:", error);
    throw new Error("Error fetching feature values");
  }
  return data;
};

// Fetch feature by category ID
exports.findFeaturesByCategory = async function (req: Request, res: Response) {
  try {
    const categoryId = req.params.categoryId;
    const { data, error } = await supabase
      .from(FEATURES_TABLE_NAME)
      .select("*")
      .eq('category_id', categoryId);

    if (error) {
      throw new Error(error.message);
    }
    res.json(data); // Envía los datos de características como respuesta
  } catch (error) {
    console.error("Error fetching feature values:", error);
    res.status(500).json({ error: "Failed to fetch feature values" });
  }
};
