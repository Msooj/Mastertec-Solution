import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://ithmgtvazxkxzvxwuawy.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error("⚠️ REACT_APP_SUPABASE_ANON_KEY is missing! Please create a .env file with your Supabase credentials.");
  console.error("Add this to your .env file:");
  console.error("REACT_APP_SUPABASE_URL=https://ithmgtvazxkxzvxwuawy.supabase.co");
  console.error("REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here");
  console.error("Get your anon key from: https://app.supabase.com/project/ithmgtvazxkxzvxwuawy/settings/api");
}

export const supabase = createClient(supabaseUrl, supabaseKey || "dummy-key");
