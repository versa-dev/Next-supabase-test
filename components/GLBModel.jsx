import { useGLTF } from "@react-three/drei";

function GLBModel({ url }) {
  const gltf = useGLTF(url);
  return <primitive object={gltf.scene} />;
}

export default GLBModel;
