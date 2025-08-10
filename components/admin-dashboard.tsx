import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  if (!user) return <div>Loading user...</div>;

  return <div>Welcome, {user.email}</div>;
}
