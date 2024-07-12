import { createClient } from "@supabase/supabase-js";
import { Request, Response } from "express";

// Configuración de Supabase
const supabaseUrl: string = process.env.SUPABASE_URL as string;
const supabaseKey: string = process.env.SUPABASE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

const PRODUCTS_TABLE_NAME: string = "products";
const CATEGORIES_TABLE_NAME: string = "categories";
const PAGE_SIZE = 20; // Tamaño de página

// Función para encontrar todos los productos.
exports.findAll = async function (res: Response) {
  try {
    const { data, error } = await supabase.from(PRODUCTS_TABLE_NAME).select(`
        *,
        ${CATEGORIES_TABLE_NAME} (
          category_name_es,
          category_name_en,
          category_name_ca,
          category_description_es,
          category_description_ca,
          category_description_en
        )
      `);

    if (error) {
      throw new Error(error.message);
    }

    res.send(data);
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};

// Función para filtrar los productos por oferta.
exports.offerProducts = async function (res: Response) {
  try {
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE_NAME)
      .select(
        `
        *,
        ${CATEGORIES_TABLE_NAME} (
          category_name_es,
          category_name_en,
          category_name_ca,
          category_description_es,
          category_description_ca,
          category_description_en
        )
      `
      )
      .eq("offer", true)
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

// Función para encontrar un producto por su ID.
exports.findById = async function (req: Request, res: Response) {
  try {
    const id = req.params.productId;
    const { data: product, error } = await supabase
      .from(PRODUCTS_TABLE_NAME)
      .select(
        `
        *,
        ${CATEGORIES_TABLE_NAME} (
          category_name_es,
          category_name_en,
          category_name_ca,
          category_description_es,
          category_description_ca,
          category_description_en
        )
      `
      )
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

// Función para encontrar 10 productos según su categoría.
exports.productsByCategory = async function (req: Request, res: Response) {
  try {
    const categoryId = req.params.category_id;
    const page = parseInt(req.query.page as string) || 1; // Página actual, por defecto la primera página

    // Calcular el offset según la página solicitada
    const offset = (page - 1) * PAGE_SIZE;

    const { data, error } = await supabase
      .from(PRODUCTS_TABLE_NAME)
      .select(
        `
        *,
        ${CATEGORIES_TABLE_NAME} (
          category_name_es,
          category_name_en,
          category_name_ca,
          category_description_es,
          category_description_ca,
          category_description_en
        )
      `
      )
      .eq("category_id", categoryId)
      .range(offset, offset + PAGE_SIZE - 1)
      .order("id", { ascending: true });

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

// Función para buscar productos por nombre.
exports.searchByName = async function (name: string, res: Response) {
  try {
    // Validar que el parámetro 'name' esté presente y sea una cadena válida
    if (!name || typeof name !== "string") {
      return res.status(400).send({ error: "Invalid search parameter: name" });
    }

    // Ejecutar la consulta para buscar productos cuyo nombre contenga el valor del parámetro 'name'
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE_NAME)
      .select(
        `
        *,
        ${CATEGORIES_TABLE_NAME} (
          category_name_es,
          category_name_en,
          category_name_ca,
          category_description_es,
          category_description_ca,
          category_description_en
        )
      `
      )
      .ilike("name", `%${name}%`) // Uso de 'ilike' para búsqueda insensible a mayúsculas y minúsculas
      .limit(40);
    if (error) {
      throw new Error(error.message);
    }

    // Retornar los resultados
    res.send(data);
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};


// Función para buscar productos por nombre y categoría.
exports.searchByNameAndCategory = async function (name: string, category: string, res: Response) {
  try {
    console.log(`Searching for products with name: ${name} and category: ${category}`);
    if (!name || typeof name !== "string") {
      return res.status(400).send({ error: "Invalid search parameter: name" });
    }

    let query = supabase
      .from(PRODUCTS_TABLE_NAME)
      .select(
        `
        *,
        ${CATEGORIES_TABLE_NAME} (
          category_name_es,
          category_name_en,
          category_name_ca,
          category_description_es,
          category_description_ca,
          category_description_en
        )
      `
      )
      .ilike("name", `%${name}%`) // Uso de 'ilike' para búsqueda insensible a mayúsculas y minúsculas
      .limit(10);

    if (category) {
      query = query.eq("category_id", category); // Agregar filtro de categoría
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    console.log('Products found:', data);
    res.send(data);
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error searching for products:', err.message);
    res.status(500).send({ error: err.message });
  }
};
