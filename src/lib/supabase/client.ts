"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./config";

export function createClient() {
  if (!isSupabaseConfigured) {
    return null;
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
