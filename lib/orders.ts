import { supabase } from '@/lib/supabaseClient';

// Fetch all orders (optional: for admin dashboard)
export async function getOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Save a new tracksuit order
export async function saveTracksuitOrder(orderData: {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  product_name: string;
  product_id?: string;
  quantity: number;
  price: number;
  payment_status?: string;
}) {
  const { data, error } = await supabase.from('orders').insert([orderData]);
  if (error) throw error;
  return data;
}
