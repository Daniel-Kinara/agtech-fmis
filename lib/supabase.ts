import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cbhafbdyxfgyxscibxqw.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiaGFmYmR5eGZneXhzY2lieHF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNDAxMTIsImV4cCI6MjA5MzgxNjExMn0.pZKA1Q682nbECbleqP4wTVDRAhUsoTr2k0fyd66B7Yc"

// Type guard to ensure keys exist
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)