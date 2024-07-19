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
    const { product_id, user_id, rating, review, likes } = req.body;

    // Validar los datos de entrada
    if (!product_id || !user_id || !rating || !review || likes === undefined) {
      throw new Error(
        "id_product, user_id, rating, comment, and likes are required"
      );
    }

    // Insertar la nueva reseña en la base de datos
    const { data, error } = await supabase
      .from(REVIEWS_TABLE_NAME)
      .insert([{ product_id, user_id, rating, review, likes }]);
    console.log(data);

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

// Función para actualizar los likes de una review por su id
export async function updateLikes(
  reviewId: number,
  incrementBy: number | undefined,
  setLikesTo: number | undefined
): Promise<{ message: string; review: any } | { error: string }> {
  try {
    // Validar que reviewId esté definido y no sea undefined
    if (isNaN(reviewId)) {
      throw new Error("Review ID must be a valid number");
    }

    // Obtener la review actual
    const { data: currentReview, error: fetchError } = await supabase
      .from(REVIEWS_TABLE_NAME)
      .select("likes")
      .eq("id", reviewId)
      .single();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    if (!currentReview) {
      return { error: `No review found for ID ${reviewId}` };
    }

    let newLikes;

    // Determinar el nuevo valor de likes
    if (incrementBy !== undefined) {
      newLikes = currentReview.likes + incrementBy;
    } else if (setLikesTo !== undefined) {
      newLikes = setLikesTo;
    } else {
      throw new Error("Either incrementBy or setLikesTo must be provided");
    }

    // Actualizar el valor de likes
    const { data, error } = await supabase
      .from(REVIEWS_TABLE_NAME)
      .update({ likes: newLikes })
      .eq("id", reviewId);

    if (error) {
      throw new Error(error.message);
    }

    return { message: "Likes updated successfully", review: data };
  } catch (error) {
    throw new Error("Either incrementBy or setLikesTo must be provided");
  }
}
