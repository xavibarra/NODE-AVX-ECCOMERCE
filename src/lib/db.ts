import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

export default supabase;
