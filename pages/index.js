import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import GLBModel from "../components/GLBModel";
import styles from "../styles/Home.module.css";

const sampleFile = "http://localhost:3000/sample.glb";

export default function Home() {
  const router = useRouter();
  const session = useSession();
  const [file, setFile] = useState();
  const [files, setFiles] = useState([]);
  const supabase = useSupabaseClient();

  const onClickUpload = async () => {
    const { data, error } = await supabase.storage
      .from("files")
      .upload(`public/${file.name}`, file, {
        cacheControl: "3600",
        upsert: false,
      });
  };

  useEffect(() => {
    if (!session) router.push("/login");

    const init = async () => {
      const { data, error } = await supabase.storage
        .from("files")
        .list("public", {
          limit: 100,
          offset: 0,
          sortBy: { column: "name", order: "asc" },
        });

      console.log("data===>", data);

      const glbs = data.filter((item) => item.name.split(".").includes("glb"));

      setFiles([...glbs]);

      // if (!error) {
      //   const result = await Promise.all(
      //     data
      //       .filter((item) => item.metadata)
      //       .map(async (item) => {
      //         const { data: gtbFile, error } = await supabase.storage
      //           .from("files")
      //           .download(`public/${item.name}`);

      //         return gtbFile;
      //       })
      //   );

      //   setFiles([...result]);
      // }
    };

    init();
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={onClickUpload}>Upload</button>

        <div>
          {/* {files.map((item) => (
            <GLBModel key={item.name} url={item.url} />
          ))} */}
          <GLBModel url={sampleFile} />
        </div>
      </main>
    </div>
  );
}
