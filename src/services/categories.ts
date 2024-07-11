import { createClient } from "@supabase/supabase-js";
import { Request, Response } from "express";

// Configuración de Supabase
const supabaseUrl: string = process.env.SUPABASE_URL as string;
const supabaseKey: string = process.env.SUPABASE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

const CATEGORIES_TABLE_NAME: string = "categories";

// Función para encontrar todas las categorías.
exports.findAll = async function (req: Request, res: Response) {
  try {
    const { data: categories, error } = await supabase
      .from(CATEGORIES_TABLE_NAME)
      .select("*");

    res.send(categories);
    if (error) {
      throw new Error(error.message);
    }
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};

// Función para encontrar una categoría por su ID.
exports.findById = async function (req: Request, res: Response) {
  try {
    const id = req.params.categoryId;
    const { data: category, error } = await supabase
      .from(CATEGORIES_TABLE_NAME)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!category) {
      res.status(404).send({ message: "Category not found" });
    } else {
      res.send(category);
    }
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};

// Función para crear una nueva categoría.
exports.create = async function (req: Request, res: Response) {
  try {
    const {
      category_name_es,
      category_name_en,
      category_name_ca,
      category_description_es,
      category_description_en,
      category_description_ca,
    } = req.body;

    const { error } = await supabase.from(CATEGORIES_TABLE_NAME).insert([
      {
        category_name_es,
        category_name_en,
        category_name_ca,
        category_description_es,
        category_description_en,
        category_description_ca,
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }

    res.send({ message: "Category created successfully" });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};

// Función para crear múltiples categorías.
exports.createMultiple = async function (req: Request, res: Response) {
  try {
    const categories = req.body;
    const { error } = await supabase
      .from(CATEGORIES_TABLE_NAME)
      .insert(categories);

    if (error) {
      throw new Error(error.message);
    }

    res.send({ message: "Categories created successfully" });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};

// Función para eliminar una categoría por su ID.
exports.delete = async function (id: string, res: Response) {
  try {
    const { error } = await supabase
      .from(CATEGORIES_TABLE_NAME)
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    res.send({ message: "Category deleted successfully" });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};

// Función para actualizar una categoría por su ID.
exports.update = async function (
  id: string,
  updatedCategory: any,
  res: Response
) {
  try {
    const { error } = await supabase
      .from(CATEGORIES_TABLE_NAME)
      .update(updatedCategory)
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    res.send({ message: "Category updated successfully" });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};


exports.getCategories = async () => {
  const { data, error } = await supabase
    .from('categories') // Asegúrate de que 'categories' es el nombre correcto de la tabla
    .select('id, category_name_en'); // Asegúrate de que 'name' es el nombre correcto de la columna que contiene los nombres de las categorías
  if (error) {
    throw new Error(error.message);
  }
  return data;
};
