import { createClient } from "@supabase/supabase-js";
import { Request, Response } from "express";

// Configuración de Supabase
const supabaseUrl: string = process.env.SUPABASE_URL as string;
const supabaseKey: string = process.env.SUPABASE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

const USUARIOS_TABLE_NAME: string = "profiles";

// Función para encontrar todos los usuarios.
exports.findAll = async function (req: Request, res: Response) {
  try {
    const { data: categories, error } = await supabase
      .from(USUARIOS_TABLE_NAME)
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

// Función para obtener un usuario por su ID
exports.getUserById = async function (req: Request, res: Response) {
  try {
    const userId = req.params.userId; // Obtener el ID del usuario desde los parámetros de la URL

    // Verificar que el userId esté presente y sea válido
    if (!userId) {
      throw new Error("User ID is required");
    }

    const { data: user, error: userError } = await supabase
      .from(USUARIOS_TABLE_NAME)
      .select("*")
      .eq("id", userId)
      .single();

    if (userError) {
      throw new Error(userError.message);
    }

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    res.send(user); // Enviar los datos del usuario encontrado
  } catch (error) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};

// Función para crear un nuevo usuario
exports.create = async function (req: Request, res: Response) {
  try {
    const { id, admin, cart, likes } = req.body;

    const { error } = await supabase.from(USUARIOS_TABLE_NAME).insert([
      {
        id,
        admin,
        cart,
        likes,
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }

    res.send({ message: "User created successfully" });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};

// Función para añadir un producto al carrito de un usuario.
exports.addToCart = async function (req: Request, res: Response) {
  try {
    const { userId, productId } = req.body; // Ahora solo esperamos la ID del usuario desde el frontend

    // Verificamos que el userId esté presente
    if (!userId) {
      throw new Error("User ID is required");
    }

    const { data: user, error: userError } = await supabase
      .from(USUARIOS_TABLE_NAME)
      .select("id, cart")
      .eq("id", userId)
      .single();

    if (userError) {
      throw new Error(userError.message);
    }

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Aseguramos que user.cart sea un array
    const userCart = user.cart || []; // Si user.cart es null o undefined, establecemos un array vacío

    // Verificamos que userCart sea un array antes de manipularlo
    if (!Array.isArray(userCart)) {
      throw new Error("User cart is not a valid array");
    }

    // Actualizamos el carrito del usuario
    const updatedCart = [...userCart, productId];

    const { error } = await supabase
      .from(USUARIOS_TABLE_NAME)
      .update({ cart: updatedCart })
      .eq("id", userId);

    if (error) {
      throw new Error(error.message);
    }

    res.send({ message: "Product added to cart successfully" });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};

// Función para añadir un producto a los likes de un usuario.
exports.addToLikes = async function (req: Request, res: Response) {
  try {
    const { userId, productId } = req.body;

    // Verificamos que el userId esté presente
    if (!userId) {
      throw new Error("User ID is required");
    }

    const { data: user, error: userError } = await supabase
      .from(USUARIOS_TABLE_NAME)
      .select("id, likes")
      .eq("id", userId)
      .single();

    if (userError) {
      throw new Error(userError.message);
    }

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Aseguramos que user.likes sea un array
    const userLikes = user.likes || []; // Si user.likes es null o undefined, establecemos un array vacío

    // Verificamos que userLikes sea un array antes de manipularlo
    if (!Array.isArray(userLikes)) {
      throw new Error("User likes is not a valid array");
    }

    // Verificamos si el producto ya está en los likes del usuario
    if (userLikes.includes(productId)) {
      res.send({ message: "Product already liked by user" });
      return;
    }

    // Actualizamos los likes del usuario
    const updatedLikes = [...userLikes, productId];

    const { error } = await supabase
      .from(USUARIOS_TABLE_NAME)
      .update({ likes: updatedLikes })
      .eq("id", userId);

    if (error) {
      throw new Error(error.message);
    }

    res.send({ message: "Product added to likes successfully" });
  } catch (error) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};
