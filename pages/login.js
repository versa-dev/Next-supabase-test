import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "../styles/Login.module.css";
import { useEffect } from "react";

const Home = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState(false);

  const onSubmit = async () => {
    try {
      await supabase.auth.signInWithOtp({ email });
      setNotification(true);
    } catch (error) {
      console.log("error ==> ", error);
    }
  };

  if (session) router.push("/");
  useEffect(() => {
    return () => {
      setNotification(false);
    };
  }, []);

  return (
    <div className={styles.container} style={{ padding: "50px 0 100px 0" }}>
      <div>
        {notification && (
          <div className={styles.notification}>
            Request url is sent to your email.
          </div>
        )}
        <div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.userInput}
          />
          <button onClick={onSubmit} className={styles.loginButton}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
