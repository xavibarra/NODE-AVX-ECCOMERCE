import { createClient } from "@supabase/supabase-js";
import { Request, Response } from "express";

// Configuración de Supabase
const supabaseUrl: string = process.env.SUPABASE_URL as string;
const supabaseKey: string = process.env.SUPABASE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

const REVIEWS_TABLE_NAME: string = "reviews";

// Función para encontrar todas las reviews
exports.findAll = async function (res: Response) {
  try {
    const { data, error } = await supabase.from(REVIEWS_TABLE_NAME).select(`*`);

    if (error) {
      console.error("Error fetching reviews:", error.message); // Log de error
      throw new Error(error.message);
    }
    res.send(data);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Unexpected error:", err.message); // Log de error inesperado
    res.status(500).send({ error: err.message });
  }
};
// Función para encontrar las reviwes de un producto por su id
export async function findReviewsByProductId(req: Request, res: Response) {
  try {
    const productId = parseInt(req.params.product_id);

    // Validar que productId esté definido y no sea undefined
    if (isNaN(productId)) {
      throw new Error("Product ID must be a valid number");
    }

    // Construir la consulta con filtro explícito
    const { data, error, count } = await supabase
      .from(REVIEWS_TABLE_NAME)
      .select("*")
      .eq("product_id", productId);

    if (error) {
      console.error("Error fetching reviews:", error.message);
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      res
        .status(404)
        .send({ error: `No reviews found for product ID ${productId}` });
      return;
    }

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
    const { data, error } = await supabase
      .from(REVIEWS_TABLE_NAME)
      .insert([{ id_product, rating, comment }]);

    if (error) {
      throw new Error(error.message);
    }

    res
      .status(201)
      .send({ message: "Review created successfully", review: data });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};
