import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SupabaseStatus() {
  const [status, setStatus] = useState("Checking...");

  useEffect(() => {
    supabase
      .from("your_table")
      .select("*")
      .then(({ error }) => {
        setStatus(error ? `Error: ${error.message}` : "Supabase connected");
      });
  }, []);

  return <div>{status}</div>;
}
