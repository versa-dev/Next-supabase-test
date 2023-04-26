import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/router";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import styles from "../styles/Home.module.css";
import ModelContainer from "../components/ModelContainer";

export default function Home() {
  const router = useRouter();
  const session = useSession();
  const [file, setFile] = useState();
  const [files, setFiles] = useState([]);
  const supabase = useSupabaseClient();

  const onClickUpload = async () => {
    const filedata = {
      cacheControl: "3600",
      upsert: false,
    };
    try {
      await supabase.storage
        .from("files")
        .upload(`public/${session.user.id}-${file.name}`, file, filedata);
      getFiles();
    } catch (error) {
      console.log(error);
    }
  };

  console.log("session ===>", session);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const getFiles = async () => {
    const user_id = session.user.id;
    const { data, error } = await supabase.storage
      .from("files")
      .list("public", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      })
      .then(({ data }) => {
        const filteredData = data.filter((file) => {
          return file.name.indexOf(user_id) > -1;
        });
        return { data: filteredData };
      })
      .catch((error) => {
        return { error };
      });

    const glbs = data
      .filter((item) => item.name.split(".").includes("gltf"))
      .map((item) => `public/${item.name}`);

    setFiles(glbs);
  };

  useEffect(() => {
    if (!session) {
      router.push("/login");
    } else {
      getFiles();
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.uploader}>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className={styles.inputFile}
          />
          <button onClick={onClickUpload} className={styles.submitButton}>
            Upload
          </button>
        </div>
        <button onClick={handleLogout} className={styles.logOut}>
          LogOut
        </button>
      </div>
      <main className={styles.main}>
        {files.map((file) => (
          <div style={{ width: 300, height: 300 }}>
            <ModelContainer filePath={file} />
          </div>
        ))}
      </main>
    </div>
  );
}
