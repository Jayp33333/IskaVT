import {
  Environment,
  Gltf,
  PerspectiveCamera,
  useTexture,
  Billboard,
  Html,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import useWorld from "../hooks/useWorld";
import { IoLocationSharp } from "react-icons/io5";

interface MiniMapProps {
  showMiniMap: boolean;
}

const tmpVector = new THREE.Vector3();

// Define map boundaries
const MAP_BOUNDS = {
  minX: -30,
  maxX: 30,
  minZ: -50,
  maxZ: 20,
  minZoom: 5,
  maxZoom: 50,
};

export function MiniMap({ showMiniMap }: MiniMapProps) {
  const defaultZoom = 12;

  const characterPosition = useWorld(
    (state: any) => state.characterPosition
  ) as THREE.Vector3;
  const pinPosition = useWorld(
    (state: any) => state.pinPosition
  ) as THREE.Vector3 | null;
  const setPinPosition = useWorld((state: any) => state.setPinPosition) as (
    pos: THREE.Vector3
  ) => void;
  const selectPin = useWorld((state: any) => state.selectPin) as boolean;
  const isPinConfirmed = useWorld(
    (state: any) => state.isPinConfirmed
  ) as boolean;
  const currentZoom = useWorld((state: any) => state.currentZoom) as number;
  const setCurrentZoom = useWorld((state: any) => state.setCurrentZoom) as (
    zoom: number
  ) => void;

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cameraPosition, setCameraPosition] = useState(
    new THREE.Vector3(0, defaultZoom, 0)
  );

  const character = useRef<THREE.Group>(null);
  const { camera, gl, raycaster, mouse } = useThree();

  const profileTexture = useTexture("/textures/character-in-map.jpg");
  // const pinTexture = useTexture("/textures/pin.png");
  const mapModel = "./models/de_dust_2_with_real_light.glb";

  // Initialize camera
  useEffect(() => {
    if (!characterPosition) return;

    if (showMiniMap) {
      setCameraPosition(
        new THREE.Vector3(
          THREE.MathUtils.clamp(
            characterPosition.x,
            MAP_BOUNDS.minX,
            MAP_BOUNDS.maxX
          ),
          currentZoom,
          THREE.MathUtils.clamp(
            characterPosition.z,
            MAP_BOUNDS.minZ,
            MAP_BOUNDS.maxZ
          )
        )
      );
    } else {
      setCameraPosition(
        new THREE.Vector3(
          characterPosition.x,
          characterPosition.y + defaultZoom,
          characterPosition.z
        )
      );
    }
  }, [showMiniMap, characterPosition]);

  // Update camera height on zoom change
  useEffect(() => {
    if (showMiniMap) {
      setCameraPosition((prev) => {
        const newPos = prev.clone();
        newPos.y = THREE.MathUtils.clamp(
          currentZoom,
          MAP_BOUNDS.minZoom,
          MAP_BOUNDS.maxZoom
        );
        return newPos;
      });
    }
  }, [currentZoom, showMiniMap]);

  // Drag handlers
  const handlePointerDown = (event: PointerEvent) => {
    if (!showMiniMap) return;
    event.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: event.clientX, y: event.clientY });
    gl.domElement.style.cursor = "grabbing";
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (!showMiniMap || !isDragging) return;

    const deltaX = event.clientX - dragStart.x;
    const deltaY = event.clientY - dragStart.y;

    const dragSensitivity = 0.02 * (currentZoom / defaultZoom);

    setCameraPosition((prev) => {
      const newPos = prev.clone();
      newPos.x -= deltaX * dragSensitivity;
      newPos.z -= deltaY * dragSensitivity;

      // Clamp within map boundaries
      newPos.x = THREE.MathUtils.clamp(
        newPos.x,
        MAP_BOUNDS.minX,
        MAP_BOUNDS.maxX
      );
      newPos.z = THREE.MathUtils.clamp(
        newPos.z,
        MAP_BOUNDS.minZ,
        MAP_BOUNDS.maxZ
      );

      return newPos;
    });

    setDragStart({ x: event.clientX, y: event.clientY });
  };

  const handlePointerUp = (event: PointerEvent) => {
    const dragDistance = Math.sqrt(
      Math.pow(event.clientX - dragStart.x, 2) +
        Math.pow(event.clientY - dragStart.y, 2)
    );

    setIsDragging(false);

    if (showMiniMap && dragDistance < 5 && selectPin && !isPinConfirmed) {
      handleMapClick(event);
    }

    if (showMiniMap) gl.domElement.style.cursor = "grab";
  };

  const handleMapClick = (event: PointerEvent) => {
    if (!showMiniMap) return;
    event.stopPropagation();

    const rect = gl.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    mouse.x = x;
    mouse.y = y;

    raycaster.setFromCamera(mouse, camera);

    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersectionPoint = new THREE.Vector3();

    if (raycaster.ray.intersectPlane(groundPlane, intersectionPoint)) {
      setPinPosition(
        new THREE.Vector3(
          THREE.MathUtils.clamp(
            intersectionPoint.x,
            MAP_BOUNDS.minX,
            MAP_BOUNDS.maxX
          ),
          2,
          THREE.MathUtils.clamp(
            intersectionPoint.z,
            MAP_BOUNDS.minZ,
            MAP_BOUNDS.maxZ
          )
        )
      );
    }
  };

  // Zoom
  const handleWheel = (event: WheelEvent) => {
    if (!showMiniMap) return;
    event.preventDefault();
    event.stopPropagation();

    const zoomChange = event.deltaY > 0 ? 1.1 : 0.9;
    setCurrentZoom(zoomChange);
  };

  useEffect(() => {
    const canvas = gl.domElement;

    if (showMiniMap) {
      canvas.style.cursor = "grab";
      canvas.addEventListener("pointerdown", handlePointerDown);
      canvas.addEventListener("pointermove", handlePointerMove);
      canvas.addEventListener("pointerup", handlePointerUp);
      canvas.addEventListener("wheel", handleWheel, { passive: false });
    } else {
      canvas.style.cursor = "default";
      setCurrentZoom(1);
    }

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [showMiniMap, gl, isDragging, dragStart]);

  useFrame(() => {
    if (showMiniMap) {
      camera.position.copy(cameraPosition);
      tmpVector.set(cameraPosition.x, 0, cameraPosition.z);
      camera.lookAt(tmpVector);
      camera.rotation.z = 0;
    } else if (characterPosition) {
      tmpVector.set(
        characterPosition.x,
        characterPosition.y + defaultZoom,
        characterPosition.z
      );
      camera.position.copy(tmpVector);
      tmpVector.set(
        characterPosition.x,
        characterPosition.y,
        characterPosition.z
      );
      camera.lookAt(tmpVector);
    }

    if (character.current && characterPosition) {
      character.current.position.copy(characterPosition);
    }
  });

  return (
    <>
      <color attach="background" args={["#ececec"]} />
      <ambientLight intensity={0.8} />
      <Environment preset="city" />
      <PerspectiveCamera makeDefault position={[0, currentZoom, 0]} />
      <Gltf position={[0, 0.1, 0]} src={mapModel} />

      {pinPosition && (
        <Billboard position={[pinPosition.x, pinPosition.y, pinPosition.z]}>
          <Html center>
            <IoLocationSharp size={40} color="red" />
          </Html>
        </Billboard>
      )}

      <group ref={character}>
        <mesh renderOrder={1} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[0.6, 32]} />
          <meshBasicMaterial
            color="#ffffff"
            depthTest={false}
            map={profileTexture}
          />
        </mesh>
        <mesh position-y={-0.01} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[0.65, 32]} />
          <meshBasicMaterial color="red" depthTest={false} />
        </mesh>
      </group>
    </>
  );
}
