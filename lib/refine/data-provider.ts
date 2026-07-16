import { dataProvider } from "@refinedev/supabase";
import { createClient } from "@/lib/supabase/client";

export const supabaseDataProvider = dataProvider(createClient());
