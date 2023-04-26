import { createClient } from "@supabase/supabase-js";
import { apiKey, apiUrl } from "./constant";

export const supabaseClient = createClient(apiUrl, apiKey);
