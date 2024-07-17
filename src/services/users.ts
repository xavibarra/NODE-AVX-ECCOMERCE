import { createClient } from "@supabase/supabase-js";
import { NextFunction, Request, Response } from "express";

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

// Función para verificar si un producto está en los likes de un usuario.
exports.checkLike = async function (req: Request, res: Response) {
  try {
    const { userId, productId } = req.query;

    // Verificar que userId y productId estén presentes en la consulta
    if (!userId || !productId) {
      throw new Error("User ID and Product ID are required");
    }

    // Implementa la lógica para verificar si el producto está en los likes del usuario
    const { data: userLikes, error: userError } = await supabase
      .from(USUARIOS_TABLE_NAME)
      .select("likes")
      .eq("id", userId)
      .single();

    if (userError) {
      throw new Error(userError.message);
    }

    if (!userLikes) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const likesArray = userLikes.likes || [];
    const isLiked = likesArray.includes(productId);

    res.send({ isLiked });
  } catch (error) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};

// Función para remover un producto de los likes de un usuario.
exports.removeToLikes = async function (req: Request, res: Response) {
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

    // Verificamos si el producto está en los likes del usuario
    const index = userLikes.indexOf(productId);
    if (index === -1) {
      res.send({ message: "Product not found in user's likes" });
      return;
    }

    // Removemos el producto de los likes del usuario
    userLikes.splice(index, 1);

    const { error } = await supabase
      .from(USUARIOS_TABLE_NAME)
      .update({ likes: userLikes })
      .eq("id", userId);

    if (error) {
      throw new Error(error.message);
    }

    res.send({ message: "Product removed from likes successfully" });
  } catch (error) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};

// Función para vaciar el carrito de un usuario.
exports.emptyCart = async function (req: Request, res: Response) {
  try {
    const userId = req.params.userId;

    // Verificamos que el userId esté presente
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Actualizar la columna 'cart' del usuario para vaciarla (ponerla en null)
    const { data, error } = await supabase
      .from(USUARIOS_TABLE_NAME)
      .update({ cart: null })
      .eq("id", userId); // Asegúrate de que estás usando "id" aquí

    if (error) {
      throw new Error(error.message);
    }

    res.send({ message: "Cart emptied successfully" });
  } catch (error) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};

// Middleware para verificar si el usuario es administrador
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id; // Suponiendo que tienes el ID del usuario en req.user.id

    // Consultar la base de datos para obtener el perfil del usuario
    const { data: user, error: userError } = await supabase
      .from(USUARIOS_TABLE_NAME)
      .select('admin')
      .eq('id', userId)
      .single();

    if (userError) {
      throw new Error(userError.message);
    }

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Verificar si el usuario es administrador
    if (user.admin === true) {
      next(); // Continuar con la solicitud si el usuario es administrador
    } else {
      res.status(403).json({ message: 'Unauthorized access' });
    }
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

