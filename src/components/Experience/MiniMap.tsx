import {
  Environment,
  Gltf,
  PerspectiveCamera,
  useTexture,
  Billboard,
  Html,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import useWorld from "../../hooks/useWorld";
import { IoLocationSharp } from "react-icons/io5";

const tmpVector = new THREE.Vector3();

// Map boundaries
const MAP_BOUNDS = {
  minX: -70,
  maxX: 90,
  minZ: -145,
  maxZ: 20,
  minZoom: 10,
  maxZoom: 100,
};

export function MiniMap() {
  const defaultZoom = 24;

  // --- Zustand state ---
  const {
    characterPosition,
    pinPosition,
    setPinPosition,
    currentZoom,
    setCurrentZoom,
    avatar: currentAvatar,
    showMiniMap,
    isPinConfirmed,
  } = useWorld((state: any) => ({
    characterPosition: state.characterPosition,
    pinPosition: state.pinPosition,
    setPinPosition: state.setPinPosition,
    currentZoom: state.currentZoom,
    setCurrentZoom: state.setCurrentZoom,
    avatar: state.avatar,
    showMiniMap: state.showMiniMap,
    isPinConfirmed: state.isPinConfirmed,
  }));

  const { camera, gl, raycaster, mouse } = useThree();
  const character = useRef<THREE.Group>(null);

  // --- Textures ---
  const girlTexture = useTexture("/images/headIconGirl.png");
  const boyTexture = useTexture("/images/headIconBoy.png");
  const profileTexture = currentAvatar.id === 187571 ? girlTexture : boyTexture;

  const mapModel = "./models/PUPCampus.glb";

  // --- Local state ---
  const [cameraPosition, setCameraPosition] = useState(
    new THREE.Vector3(0, defaultZoom, 0)
  ); // current interpolated camera
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastTap, setLastTap] = useState(0);
  const [pinchStartDistance, setPinchStartDistance] = useState<number | null>(
    null
  );
  const [velocity, setVelocity] = useState({ x: 0, z: 0 });

  // --- Helper: distance between two touches ---
  const getTouchDistance = (touches: TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // --- Camera updates when character moves ---
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

  // --- Pin placement ---
  const placePin = useCallback(
    (event: PointerEvent | TouchEvent) => {
      if (!showMiniMap) return;
      event.stopPropagation();

      const rect = gl.domElement.getBoundingClientRect();
      const clientX =
        (event as PointerEvent).clientX ??
        (event as TouchEvent).touches[0].clientX;
      const clientY =
        (event as PointerEvent).clientY ??
        (event as TouchEvent).touches[0].clientY;

      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersect = new THREE.Vector3();

      if (raycaster.ray.intersectPlane(plane, intersect)) {
        setPinPosition(
          new THREE.Vector3(
            THREE.MathUtils.clamp(
              intersect.x,
              MAP_BOUNDS.minX,
              MAP_BOUNDS.maxX
            ),
            0.2,
            THREE.MathUtils.clamp(intersect.z, MAP_BOUNDS.minZ, MAP_BOUNDS.maxZ)
          )
        );
      }
    },
    [camera, gl, mouse, raycaster, setPinPosition, showMiniMap]
  );

  // --- Mouse / pointer handlers ---
  const handlePointerDown = (e: PointerEvent) => {
    if (!showMiniMap) return;
    e.stopPropagation();

    const now = Date.now();
    if (now - lastTap < 300 && !isPinConfirmed) {
      placePin(e); // double-tap / double-click
    } else {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
    setLastTap(now);

    gl.domElement.style.cursor = "grabbing";
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!showMiniMap || !isDragging) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    const sensitivity = 0.03 * (currentZoom / defaultZoom);

    setCameraPosition((prev) => {
      const next = prev.clone();
      next.x = THREE.MathUtils.clamp(
        prev.x - deltaX * sensitivity,
        MAP_BOUNDS.minX,
        MAP_BOUNDS.maxX
      );
      next.z = THREE.MathUtils.clamp(
        prev.z - deltaY * sensitivity,
        MAP_BOUNDS.minZ,
        MAP_BOUNDS.maxZ
      );
      return next;
    });

    // Update velocity for inertia
    setVelocity({ x: -deltaX * sensitivity, z: -deltaY * sensitivity });

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    gl.domElement.style.cursor = "grab";
  };

  const handleWheel = (e: WheelEvent) => {
    if (!showMiniMap) return;
    e.preventDefault();
     e.stopPropagation();
    const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
    setCurrentZoom(zoomFactor);
  };

  // --- Touch handlers ---
  const handleTouchStart = (e: TouchEvent) => {
    if (!showMiniMap) return;
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2) {
      setPinchStartDistance(getTouchDistance(e.touches));
      setIsDragging(false);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!showMiniMap) return;

    if (e.touches.length === 1 && isDragging) {
      const deltaX = e.touches[0].clientX - dragStart.x;
      const deltaY = e.touches[0].clientY - dragStart.y;
      const sensitivity = 0.03 * (currentZoom / defaultZoom);

      setCameraPosition((prev) => {
        const next = prev.clone();
        next.x = THREE.MathUtils.clamp(
          prev.x - deltaX * sensitivity,
          MAP_BOUNDS.minX,
          MAP_BOUNDS.maxX
        );
        next.z = THREE.MathUtils.clamp(
          prev.z - deltaY * sensitivity,
          MAP_BOUNDS.minZ,
          MAP_BOUNDS.maxZ
        );
        return next;
      });

      setVelocity({ x: -deltaX * sensitivity, z: -deltaY * sensitivity });
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2 && pinchStartDistance !== null) {
      const newDistance = getTouchDistance(e.touches);
      const zoomFactor = pinchStartDistance / newDistance;
      setCurrentZoom(zoomFactor);
      setPinchStartDistance(newDistance);
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (e.touches.length === 0) {
      setIsDragging(false);
      setPinchStartDistance(null);
    }
  };

  // --- Event listeners ---
  useEffect(() => {
    const canvas = gl.domElement;

    if (showMiniMap) {
      canvas.style.cursor = "grab";

      canvas.addEventListener("pointerdown", handlePointerDown);
      canvas.addEventListener("pointermove", handlePointerMove);
      canvas.addEventListener("pointerup", handlePointerUp);
      canvas.addEventListener("wheel", handleWheel, { passive: false });

      canvas.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
      canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
      canvas.addEventListener("touchend", handleTouchEnd);
      canvas.addEventListener("touchcancel", handleTouchEnd);
    } else {
      canvas.style.cursor = "default";
      setCurrentZoom(defaultZoom);
    }

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("wheel", handleWheel);

      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [showMiniMap, isDragging, dragStart, pinchStartDistance, lastTap]);

  // --- Frame updates ---
  useFrame(() => {
    if (!characterPosition) return;

    // Apply inertia when not dragging
    if (!isDragging) {
      setCameraPosition((prev) => {
        const next = prev.clone();
        next.x = THREE.MathUtils.clamp(
          prev.x + velocity.x,
          MAP_BOUNDS.minX,
          MAP_BOUNDS.maxX
        );
        next.z = THREE.MathUtils.clamp(
          prev.z + velocity.z,
          MAP_BOUNDS.minZ,
          MAP_BOUNDS.maxZ
        );
        return next;
      });

      // Friction
      setVelocity((v) => ({ x: v.x * 0.9, z: v.z * 0.9 }));
    }

    // Smooth lerp camera
    cameraPosition.lerp(
      new THREE.Vector3(
        THREE.MathUtils.clamp(
          cameraPosition.x,
          MAP_BOUNDS.minX,
          MAP_BOUNDS.maxX
        ),
        THREE.MathUtils.clamp(
          currentZoom,
          MAP_BOUNDS.minZoom,
          MAP_BOUNDS.maxZoom
        ),
        THREE.MathUtils.clamp(
          cameraPosition.z,
          MAP_BOUNDS.minZ,
          MAP_BOUNDS.maxZ
        )
      ),
      0.1
    );

    if (showMiniMap) {
      camera.position.copy(cameraPosition);
      tmpVector.set(cameraPosition.x, 0, cameraPosition.z);
      camera.lookAt(tmpVector);
      camera.rotation.z = 0;
    } else {
      const camPos = characterPosition
        .clone()
        .add(new THREE.Vector3(0, defaultZoom, 0));
      camera.position.copy(camPos);
      camera.lookAt(characterPosition);
    }

    if (character.current) {
      character.current.position.copy(characterPosition);
    }
  });

  return (
    <>
      <color attach="background" args={["#ececec"]} />
      <ambientLight intensity={0.8} />
      <Environment preset="city" />
      <PerspectiveCamera makeDefault position={[0, currentZoom, 0]} />
      <Gltf position={[10, 0.1, 0]} src={mapModel} />

      {pinPosition && (
        <Billboard position={[pinPosition.x, pinPosition.y, pinPosition.z]}>
          <Html center>
            <IoLocationSharp size={24} color="red" />
          </Html>
        </Billboard>
      )}

      <group ref={character}>
        <mesh renderOrder={1} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[1.5, 32]} />
          <meshBasicMaterial
            color="#fff"
            depthTest={false}
            map={profileTexture}
          />
        </mesh>
        <mesh position-y={-0.01} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[1.6, 32]} />
          <meshBasicMaterial color="red" depthTest={false} />
        </mesh>
      </group>
    </>
  );
}
