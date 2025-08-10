import { supabase } from "@/lib/supabaseClient";

export async function getSomeData() {
  const { data, error } = await supabase.from("your_table").select("*");
  if (error) throw error;
  return data;
}

export async function saveTracksuitOrder(orderData: any) {
  const { data, error } = await supabase.from("orders").insert([orderData]);
  if (error) throw error;
  return data;
}
