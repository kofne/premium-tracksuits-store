import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SupabaseTest() {
  const [data, setData] = useState(null);

  useEffect(() => {
    supabase
      .from("your_table")
      .select("*")
      .then(({ data, error }) => {
        if (error) {
          setData(`Error: ${error.message}`);
        } else {
          setData(JSON.stringify(data, null, 2));
        }
      });
  }, []);

  return <pre>{data}</pre>;
}
