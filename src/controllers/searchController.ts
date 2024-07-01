import { Request, Response } from 'express';
import supabase from '../lib/db';

export const searchComponents = async (req: Request, res: Response) => {
  const { query } = req.query;

  // Validar si se proporciona el parámetro de consulta
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    // Realizar la consulta a Supabase usando ilike para búsqueda case-insensitive
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .ilike('name', `%${query}%`);

    // Manejo de errores de Supabase
    if (error) {
      throw error;
    }

    // Devolver los datos obtenidos en la respuesta
    res.json(data);
  } catch (error) {
    // Manejo de errores generales
    res.status(500).json({ error: (error as Error).message });
  }
};
