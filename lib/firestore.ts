import { supabase } from "@/lib/supabaseClient";

// Optional: if you still need to fetch something
export async function getSomeData() {
  const { data, error } = await supabase.from("your_table").select("*");
  if (error) throw error;
  return data;
}

// Save tracksuit order
export async function saveTracksuitOrder(orderData: {
  customerName: string;
  email: string;
  quantity: number;
  colorChoices: string[];
  size: string;
  totalPrice: number;
  paymentStatus: "pending" | "paid";
}) {
  const { data, error } = await supabase.from("orders").insert([orderData]);
  if (error) throw error;
  return data;
}
