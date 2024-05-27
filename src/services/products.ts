import { createClient } from "@supabase/supabase-js";
import { Request, Response } from "express";

// Configuración de Supabase
const supabaseUrl: string = process.env.SUPABASE_URL as string;
const supabaseKey: string = process.env.SUPABASE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

const PRODUCTS_TABLE_NAME: string = "products";

// Función para encontrar todos los productos.
exports.findAll = async function (res: Response) {
  try {
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE_NAME)
      .select("*");

    if (error) {
      throw new Error(error.message);
    }

    res.send(data);
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};

// Función para encontrar un producto por su ID.
exports.findById = async function (req: Request, res: Response) {
  try {
    const id = req.params.productId;
    const { data: product, error } = await supabase
      .from(PRODUCTS_TABLE_NAME)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!product) {
      res.status(404).send({ message: "Product not found" });
    } else {
      res.send(product);
    }
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};

// Funcion para encontrar 10 productos según su categoria
exports.productsByCategory = async function (req: Request, res: Response) {
  try {
    const id = req.params.category_id;
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE_NAME)
      .select("*")
      .eq("category_id", id)
      .limit(10);

    if (error) {
      throw new Error(error.message);
    }
    res.send(data);
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};

// Función para crear un nuevo producto.
exports.create = async function (req: Request, res: Response) {
  try {
    const {
      name,
      price,
      category_id,
      image_url,
      isOffer,
      discount,
      rating,
      barcelonaStock,
      madridStock,
      murciaStock,
      valenciaStock,
      sevillaStock,
      sanSebastianStock,
      bilbaoStock,
      cordobaStock,
      aCorunaStock,
      segoviaStock,
    } = req.body;

    const { error } = await supabase.from(PRODUCTS_TABLE_NAME).insert([
      {
        name,
        price,
        category_id,
        image_url,
        isOffer,
        discount,
        rating,
        barcelonaStock,
        madridStock,
        murciaStock,
        valenciaStock,
        sevillaStock,
        sanSebastianStock,
        bilbaoStock,
        cordobaStock,
        aCorunaStock,
        segoviaStock,
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }

    res.send({ message: "Product created successfully" });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};

// Función para crear múltiples productos.
exports.createMultiple = async function (req: Request, res: Response) {
  try {
    const products = req.body;
    const { error } = await supabase.from(PRODUCTS_TABLE_NAME).insert(products);

    if (error) {
      throw new Error(error.message);
    }

    res.send({ message: "Products created successfully" });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};

// Función para eliminar un producto por su ID.
exports.delete = async function (id: string, res: Response) {
  try {
    const { error } = await supabase
      .from(PRODUCTS_TABLE_NAME)
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    res.send({ message: "Product deleted successfully" });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};

// Función para actualizar un producto por su ID.
exports.update = async function (
  id: string,
  updatedProduct: any,
  res: Response
) {
  try {
    const { error } = await supabase
      .from(PRODUCTS_TABLE_NAME)
      .update(updatedProduct)
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    res.send({ message: "Product updated successfully" });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};
