import { createClient } from "@supabase/supabase-js";
import { apiKey, apiUrl } from "./constant";

export const supabaseClient = createClient(apiUrl, apiKey);

supabaseClient.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_IN") {
    console.log("signed in called ==> ", session);
    const userId = session.user.id;

    supabase.rpc("create_policy", {
      table_name: "objects",
      policy_name: "user_files_policy",
      using: "id = $1",
      check: `owner = '${userId}'`,
      with_check: true,
    });
  }
});
