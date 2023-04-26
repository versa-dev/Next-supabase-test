import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useState } from "react";

const Home = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [email, setEmail] = useState("");

  const onSubmit = async () => {
    const { user, session } = await supabase.auth.signInWithOtp({ email });
  };

  console.log("login ===>", session);

  if (session) router.push("/");

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={onSubmit}>Login</button>
    </div>
  );
};

export default Home;
