import { createClient } from "@supabase/supabase-js";
import { Request, Response } from "express";

// Configuración de Supabase
const supabaseUrl: string = process.env.SUPABASE_URL as string;
const supabaseKey: string = process.env.SUPABASE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

const REVIEWS_TABLE_NAME: string = "reviews";

// Función para encontrar una reviews
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
      .eq("product_id", productId);

    console.log("Supabase URL:", supabaseUrl);
    console.log(
      "Supabase query:",
      `${supabaseUrl}/rest/v1/${REVIEWS_TABLE_NAME}?product_id=eq.${productId}`
    );
    console.log("Product ID:", productId);
    console.log("Supabase response:", { data, error, count });

    if (error) {
      console.error("Error fetching reviews:", error.message);
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      console.log(`No reviews found for product ID ${productId}`);
      res
        .status(404)
        .send({ error: `No reviews found for product ID ${productId}` });
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
