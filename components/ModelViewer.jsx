import React from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "react-three-fiber";

const ModelViewer = ({ url }) => {
  const gltf = useLoader(GLTFLoader, url);
  return (
    <group>
      <primitive object={gltf.scene} />
    </group>
  );
};

export default ModelViewer;
