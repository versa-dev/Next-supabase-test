import { useEffect, useState } from "react";
import ModelViewer from "./ModelViewer";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Canvas } from "react-three-fiber";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";

const ModelContainer = ({ filePath }) => {
  const [modelData, setModelData] = useState(null);
  const [modelUrl, setModelUrl] = useState(null);
  const supabase = useSupabaseClient();
  useEffect(() => {
    async function fetchData() {
      // Download the GLTF file from Supabase
      const { data, error } = await supabase.storage
        .from("files")
        .download(filePath);

      if (error) {
        console.log("Error downloading model:", error.message);
        return;
      }

      // Convert the downloaded binary data to a blob object
      const blob = new Blob([data], { type: "application/octet-stream" });

      // Create a blob URL from the blob object
      const url = URL.createObjectURL(blob);

      // Set the model data and URL states
      setModelData(data);
      setModelUrl(url);
    }

    fetchData();
  }, []);

  if (!modelUrl) {
    return <div>Loading model...</div>;
  }

  return (
    <Canvas>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <spotLight intensity={0.8} position={[300, 300, 400]} />
        <ModelViewer url={modelUrl} />
        <OrbitControls target={[0, 1, 0]} />
      </Suspense>
    </Canvas>
  );
};

export default ModelContainer;
