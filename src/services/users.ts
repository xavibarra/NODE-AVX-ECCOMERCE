import { createClient } from "@supabase/supabase-js";
import { Request, Response } from "express";

// Configuración de Supabase
const supabaseUrl: string = process.env.SUPABASE_URL as string;
const supabaseKey: string = process.env.SUPABASE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

const USUARIOS_TABLE_NAME: string = "usuarios";

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

// Función para crear una nueva categoría.
exports.create = async function (req: Request, res: Response) {
  try {
    const { id, uuid_user, admin, cart } = req.body;

    const { error } = await supabase.from(USUARIOS_TABLE_NAME).insert([
      {
        id,
        uuid_user,
        admin,
        cart,
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
