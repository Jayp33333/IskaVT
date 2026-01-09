import { useAtom } from "jotai";
import { charactersAtom, socket } from "../../services/SocketManager";
import { useRef, useEffect } from "react";
import { Vector3, Euler } from "three";
import { useGLTF } from "@react-three/drei";

const RemoteCharacters = () => {
  const [characters] = useAtom(charactersAtom);
  const refs = useRef<Record<string, any>>({});

  // Load GLB once
  const glb = useGLTF("/models/avatars/guard.glb"); // replace with your GLB path

  useEffect(() => {
    // Initialize refs for position and rotation
    characters.forEach(c => {
      if (!refs.current[c.id]) {
        refs.current[c.id] = {
          position: new Vector3(...c.position),
          rotation: new Euler(...c.rotation),
        };
      }
    });
  }, [characters]);

  return (
    <>
      {characters
        .filter(c => c.id !== socket.id) // exclude local player
        .map(c => {
          const r = refs.current[c.id];
          if (!r) return null;

          // Smooth position interpolation
          r.position.lerp(new Vector3(...c.position), 0.1);

          // Smooth rotation interpolation
          const targetEuler = new Euler(...c.rotation);
          r.rotation.x += (targetEuler.x - r.rotation.x) * 0.1;
          r.rotation.y += (targetEuler.y - r.rotation.y) * 0.1;
          r.rotation.z += (targetEuler.z - r.rotation.z) * 0.1;

          return (
            <primitive
              key={c.id}
              object={glb.scene.clone()}
              position={[r.position.x, r.position.y, r.position.z]}
              rotation={[0, r.rotation.y + Math.PI , 0]}
              scale={[1, 1, 1]}
            />
          );
        })}
    </>
  );
};

export default RemoteCharacters;
