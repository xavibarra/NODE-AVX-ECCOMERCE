import { createClient } from "@supabase/supabase-js";
import { Request, Response } from "express";

// Configuración de Supabase
const supabaseUrl: string = process.env.SUPABASE_URL as string;
const supabaseKey: string = process.env.SUPABASE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

const PRODUCTS_TABLE_NAME: string = "products";
const CATEGORIES_TABLE_NAME: string = "categories";
const REVIEWS_TABLE_NAME: string = "reviews"; 
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
      .limit(20);

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

exports.productsByCategory = async function (req: Request, res: Response) {
  try {
    const categoryId = req.params.category_id;
    const page = parseInt(req.query.page as string) || 1; // Página actual, por defecto la primera página
    const sort = req.query.sort as string; // Ordenar criterio
    const minPrice = parseInt(req.query.minPrice as string) || 1; // Precio mínimo
    const maxPrice = parseInt(req.query.maxPrice as string) || 5000; // Precio máximo

    // Calcular el offset según la página solicitada
    const offset = (page - 1) * PAGE_SIZE;

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
      .eq("category_id", categoryId)
      .range(offset, offset + PAGE_SIZE - 1);

    // Aplicar filtro por rango de precio
    query = query.gte("final_price", minPrice).lte("final_price", maxPrice);

    // Aplicar ordenación según el criterio
    if (sort === "lowestPrice") {
      query = query.order("final_price", { ascending: true });
    } else if (sort === "highestPrice") {
      query = query.order("final_price", { ascending: false });
    } else if (sort === "bestRated") {
      query = query.order("rating", { ascending: false });
    } else if (sort === "offers") {
      query = query.order("discount", { ascending: false });
    } else if (sort === "name") {
      query = query.order("name", { ascending: true });
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    // Consultar el número total de productos en la categoría
    const { count: totalCount, error: countError } = await supabase
      .from(PRODUCTS_TABLE_NAME)
      .select("id", { count: "exact" })
      .eq("category_id", categoryId);

    if (countError) {
      throw new Error(countError.message);
    }

    res.send(data);
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};

export async function findReviewsByProductId(req: Request, res: Response) {
  try {
    const productId = parseInt(req.params.product_id);

    // Validar que productId esté definido y no sea undefined
    if (isNaN(productId)) {
      throw new Error("Product ID must be a valid number");
    }

    console.log(`Fetching reviews for product ID: ${productId}`);

    // Construir la consulta con filtro explícito
    const { data, error, count } = await supabase
      .from(REVIEWS_TABLE_NAME)
      .select("*")
      .eq('product_id', productId);

    console.log("Supabase URL:", supabaseUrl);
    console.log("Supabase query:", `${supabaseUrl}/rest/v1/${REVIEWS_TABLE_NAME}?product_id=eq.${productId}`);
    console.log("Product ID:", productId);
    console.log("Supabase response:", { data, error, count });

    if (error) {
      console.error("Error fetching reviews:", error.message);
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      console.log(`No reviews found for product ID ${productId}`);
      res.status(404).send({ error: `No reviews found for product ID ${productId}` });
      return;
    }

    console.log(`Found ${data.length} reviews for product ID ${productId}`);
    res.status(200).send(data);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error:", err.message);
    res.status(500).send({ error: err.message });
  }
}


// Función para crear una nueva reseña
exports.createReview = async function (req: Request, res: Response) {
  try {
    const { id_product, rating, comment } = req.body;

    // Validar los datos de entrada
    if (!id_product || !rating || !comment) {
      throw new Error("id_product, rating, and comment are required");
    }

    // Insertar la nueva reseña en la base de datos
    const { data, error } = await supabase.from(REVIEWS_TABLE_NAME).insert([
      { id_product, rating, comment },
    ]);

    if (error) {
      throw new Error(error.message);
    }

    res.status(201).send({ message: "Review created successfully", review: data });
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


export const searchByNameCategoryAndPrice = async (name: string, category: string, minPrice: string, maxPrice: string, res: Response): Promise<void> => {
  try {
    if (!name || typeof name !== 'string') {
      res.status(400).send({ error: 'Invalid search parameter: name' });
      return;
    }

    let query = supabase
      .from(PRODUCTS_TABLE_NAME)
      .select(`
        *,
        ${CATEGORIES_TABLE_NAME} (
          category_name_es,
          category_name_en,
          category_name_ca,
          category_description_es,
          category_description_ca,
          category_description_en
        )
      `)
      .ilike('name', `%${name}%`)
      .gte('price', parseInt(minPrice, 10) || 0) // Filtro por precio mínimo
      .lte('price', parseInt(maxPrice, 10) || 1000000) // Filtro por precio máximo
      .limit(40);

    if (category && category !== 'undefined') {
      const categoryId: number = parseInt(category, 10);
      if (isNaN(categoryId)) {
        res.status(400).send({ error: 'Invalid search parameter: category' });
        return;
      }
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    res.send(data);
  } catch (error) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};
