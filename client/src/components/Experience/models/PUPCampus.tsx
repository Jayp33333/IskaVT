import * as THREE from 'three'
import { useEffect, useRef, type JSX } from 'react'
import { useGLTF } from '@react-three/drei'
import { type GLTF } from 'three-stdlib'
import { MODEL_PATHS } from '../../../data/modelRegistry'
import {
  DistanceCulledMesh,
  DistanceMeshCullProvider,
} from '../DistanceMeshCull'

type PUPCampusProps = JSX.IntrinsicElements['group'] & {
  cullDistance?: number
  shadowsEnabled?: boolean
}

type GLTFResult = GLTF & {
  nodes: {
    I_LOVE_PUP_MESH: THREE.Mesh
    I_LOVE_PUP_MESH_1: THREE.Mesh
    PYLON_MESH: THREE.Mesh
    PYLON_MESH_1: THREE.Mesh
    CR_NEAR_GYM: THREE.Mesh
    NEW_CR_MESH: THREE.Mesh
    NEW_CR_MESH_1: THREE.Mesh
    NEW_CANTEEN_MESH: THREE.Mesh
    NEW_CANTEEN_MESH_1: THREE.Mesh
    COVERED_BRIDGE: THREE.Mesh
    TAU_GAMMA: THREE.Mesh
    BROOK_MESH: THREE.Mesh
    BROOK_MESH_1: THREE.Mesh
    BROOK_SHED: THREE.Mesh
    BRIDGE_A: THREE.Mesh
    BRIDGE_B: THREE.Mesh
    ECO_PARK_CHAIRS: THREE.Mesh
    COVERED_D: THREE.Mesh
    COVERED_E: THREE.Mesh
    COVERED_C: THREE.Mesh
    EDUC_WALKWAY: THREE.Mesh
    INVISIBLE_BORDER: THREE.Mesh
    OLD_CANTEEN: THREE.Mesh
    PUP_BORDER: THREE.Mesh
    COVERED_A: THREE.Mesh
    COVERED_B: THREE.Mesh
    PUP_LAND_MESH: THREE.Mesh
    PUP_LAND_MESH_1: THREE.Mesh
    PUP_LAND_MESH_2: THREE.Mesh
    PUP_LAND_MESH_3: THREE.Mesh
    PUP_LAND_MESH_4: THREE.Mesh
    FLAG_POLE_MESH: THREE.Mesh
    FLAG_POLE_MESH_1: THREE.Mesh
    ENGINEERING_BUILDING_STRUCTURE_MESH: THREE.Mesh
    ENGINEERING_BUILDING_STRUCTURE_MESH_1: THREE.Mesh
    ENGINEERING_BUILDING_STRUCTURE_MESH_2: THREE.Mesh
    ENGINEERING_BUILDING_STRUCTURE_MESH_3: THREE.Mesh
    EDUC_BUILDING_STRUCTURE_MESH: THREE.Mesh
    EDUC_BUILDING_STRUCTURE_MESH_1: THREE.Mesh
    EDUC_BUILDING_STRUCTURE_MESH_2: THREE.Mesh
    NANTES_BUILDING_STRUCTURE_MESH: THREE.Mesh
    NANTES_BUILDING_STRUCTURE_MESH_1: THREE.Mesh
    NANTES_BUILDING_STRUCTURE_MESH_2: THREE.Mesh
    NANTES_BUILDING_STRUCTURE_MESH_3: THREE.Mesh
    GRANDSTAND: THREE.Mesh
    GYMNASIUM_MESH: THREE.Mesh
    GYMNASIUM_MESH_1: THREE.Mesh
    GYMNASIUM_MESH_2: THREE.Mesh
    HM_ROOM_STRUCTURE_1: THREE.Mesh
    HM_ROOM_STRUCTURE_2: THREE.Mesh
    HM_ROOM_STRUCTURE_3: THREE.Mesh
    SHED: THREE.Mesh
    WOOD_BUILDING: THREE.Mesh
    SOLAR_POLE: THREE.Mesh
    LIGHT_POLE2: THREE.Mesh
    TAMBAYAN: THREE.Mesh
    LIGHT_POLE1_B_02: THREE.Mesh
    LIGHT_POLE_SINGLE1: THREE.Mesh
    LIGHT_POLE_SINGLE2: THREE.Mesh
    LIGHT_POLE1_A_01: THREE.Mesh
    GREEN_HOUSE_MESH: THREE.Mesh
    GREEN_HOUSE_MESH_1: THREE.Mesh
    COMLAB2_STRUCTURE_MESH: THREE.Mesh
    COMLAB2_STRUCTURE_MESH_1: THREE.Mesh
    COMLAB2_STRUCTURE_MESH_2: THREE.Mesh
    COMLAB1_STRUCTURE_MESH: THREE.Mesh
    COMLAB1_STRUCTURE_MESH_1: THREE.Mesh
    COMLAB1_STRUCTURE_MESH_2: THREE.Mesh
    HS_BUILDING_STRUCTURE_MESH: THREE.Mesh
    HS_BUILDING_STRUCTURE_MESH_1: THREE.Mesh
    HS_BUILDING_STRUCTURE_MESH_2: THREE.Mesh
    HS_BUILDING_STRUCTURE_MESH_3: THREE.Mesh
    SHED2: THREE.Mesh
    SHED1: THREE.Mesh
    ADMIN_BUILDING_STRUCTURE_MESH: THREE.Mesh
    ADMIN_BUILDING_STRUCTURE_MESH_1: THREE.Mesh
    ADMIN_BUILDING_STRUCTURE_MESH_2: THREE.Mesh
    ADMIN_BUILDING_STRUCTURE_MESH_3: THREE.Mesh
    ADMIN_BUILDING_STRUCTURE_MESH_4: THREE.Mesh
    UMBRELLA_B_02: THREE.Mesh
    UMBRELLA_A_01: THREE.Mesh
    SINK: THREE.Mesh
    YUMUL_BUILDING_STRUCTURE_MESH: THREE.Mesh
    YUMUL_BUILDING_STRUCTURE_MESH_1: THREE.Mesh
    TREES_A_01: THREE.Mesh
    TREES_A_03: THREE.Mesh
    TREES_A_02: THREE.Mesh
    TREES_A_05: THREE.Mesh
    TREES_A_04: THREE.Mesh
    TREES_B_01: THREE.Mesh
    TREES_B_02: THREE.Mesh
    TREES_B_04: THREE.Mesh
    TREES_B_03: THREE.Mesh
    TREES_B_05: THREE.Mesh
    TREES_C_04: THREE.Mesh
    TREES_C_03: THREE.Mesh
    TREES_C_02: THREE.Mesh
    TREES_C_01: THREE.Mesh
    TREES_D_02: THREE.Mesh
    TREES_D_01: THREE.Mesh
    TREES_D_04: THREE.Mesh
    TREES_D_03: THREE.Mesh
    TREES_E_04: THREE.Mesh
    TREES_E_02: THREE.Mesh
    TREES_E_03: THREE.Mesh
    TREES_E_01: THREE.Mesh
    LIGHT_POLE1_A_04: THREE.Mesh
    LIGHT_POLE1_A_03: THREE.Mesh
    LIGHT_POLE1_A_02: THREE.Mesh
    LIGHT_POLE1_B_01: THREE.Mesh
    METAL_TANK2_MESH: THREE.Mesh
    METAL_TANK1: THREE.Mesh
    UMBRELLA_B_01: THREE.Mesh
    UMBRELLA_A_03: THREE.Mesh
    UMBRELLA_A_02: THREE.Mesh
    ECHO_PARK_ARC_MESH: THREE.Mesh
    ECHO_PARK_ARC_MESH_1: THREE.Mesh
    COVERED_F: THREE.Mesh
  }
  materials: {
    GrassTexture: THREE.MeshStandardMaterial
    COLOR_PALETTE: THREE.MeshStandardMaterial
    Glass: THREE.MeshStandardMaterial
    PLCCImageTexture: THREE.MeshStandardMaterial
    WaterColor: THREE.MeshStandardMaterial
    Invisible: THREE.MeshStandardMaterial
    ['Semi-White']: THREE.MeshStandardMaterial
    FloorTexture: THREE.MeshStandardMaterial
    DirtTexture: THREE.MeshStandardMaterial
    DirtGrassTexture: THREE.MeshStandardMaterial
    PH_Flag_Mat: THREE.MeshStandardMaterial
    MetalStainless: THREE.MeshStandardMaterial
    EngineeringImageTexture: THREE.MeshStandardMaterial
    TanLogoImageTexture: THREE.MeshStandardMaterial
    NantesImageTexture: THREE.MeshStandardMaterial
    GymnasiumImageTexture: THREE.MeshStandardMaterial
    HMSImageTexture: THREE.MeshStandardMaterial
    NET_IMAGE_TEXTURE: THREE.MeshStandardMaterial
    ComlabImageTexture: THREE.MeshStandardMaterial
    AdminBuildingImageTexture: THREE.MeshStandardMaterial
  }
}

export function PUPCampus({
  cullDistance = 80,
  shadowsEnabled = true,
  ...props
}: PUPCampusProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { nodes, materials } = useGLTF(MODEL_PATHS.campus) as unknown as GLTFResult

  useEffect(() => {
    const root = groupRef.current
    if (!root) return

    root.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = shadowsEnabled
        child.receiveShadow = shadowsEnabled
      }
    })
  }, [shadowsEnabled])

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <DistanceMeshCullProvider maxDistance={cullDistance}>
      <group
        position={[-3.401, 0.598, -20.04]}
        rotation={[0, -1.114, -Math.PI]}
        scale={[-2.209, -0.336, -3.466]}>
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.I_LOVE_PUP_MESH.geometry}
          material={materials.GrassTexture}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.I_LOVE_PUP_MESH_1.geometry}
          material={materials.COLOR_PALETTE}
        />
      </group>
      <group position={[8.583, 0, -71.736]} rotation={[0, 0.419, 0]} scale={[3.182, 0.421, 2.676]}>
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.PYLON_MESH.geometry}
          material={materials.COLOR_PALETTE}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.PYLON_MESH_1.geometry}
          material={materials.GrassTexture}
        />
      </group>
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.CR_NEAR_GYM.geometry}
        material={materials.COLOR_PALETTE}
        position={[57.74, 0.866, -132.648]}
        rotation={[0, 0.178, 0]}
        scale={[0.047, 0.45, 0.38]}
      />
      <group position={[30.251, 0.002, -162.84]} scale={0.21}>
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.NEW_CR_MESH.geometry}
          material={materials.COLOR_PALETTE}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.NEW_CR_MESH_1.geometry}
          material={materials.Glass}
        />
      </group>
      <group
        position={[-6.614, 0.01, -87.097]}
        rotation={[0, 1.353, 0]}
        scale={[7.25, 0.125, 5.362]}>
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.NEW_CANTEEN_MESH.geometry}
          material={materials.COLOR_PALETTE}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.NEW_CANTEEN_MESH_1.geometry}
          material={materials.PLCCImageTexture}
        />
      </group>
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.COVERED_BRIDGE.geometry}
        material={materials.COLOR_PALETTE}
        position={[-8.169, 0.54, -44.644]}
        rotation={[0, -0.242, 0]}
        scale={[5.96, 0.511, 1.175]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.TAU_GAMMA.geometry}
        material={materials.COLOR_PALETTE}
        position={[-19.129, 0, -39.228]}
        rotation={[0, -0.74, 0]}
        scale={[2.341, 1.698, 2.273]}
      />
      <group position={[-8.736, 0, -44.354]} rotation={[0, -0.181, 0]} scale={[0.421, 0.4, 1]}>
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.BROOK_MESH.geometry}
          material={materials.COLOR_PALETTE}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.BROOK_MESH_1.geometry}
          material={materials.WaterColor}
        />
      </group>
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.BROOK_SHED.geometry}
        material={materials.COLOR_PALETTE}
        position={[-5.109, 0.955, -64.383]}
        rotation={[0, -0.183, 0]}
        scale={[3.719, 0.816, 1.485]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.BRIDGE_A.geometry}
        material={materials.COLOR_PALETTE}
        position={[-6.436, 1.717, -53.036]}
        rotation={[0, -1.281, -Math.PI]}
        scale={[-2.496, -0.38, -3.916]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.BRIDGE_B.geometry}
        material={materials.COLOR_PALETTE}
        position={[21.42, 1.384, -84.369]}
        rotation={[0, -1.19, -Math.PI]}
        scale={[-2.496, -0.38, -3.916]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.ECO_PARK_CHAIRS.geometry}
        material={materials.COLOR_PALETTE}
        position={[-0.203, 0, -164.56]}
        rotation={[1.6, 0.022, 0.454]}
        scale={0.232}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.COVERED_D.geometry}
        material={materials.COLOR_PALETTE}
        position={[-11.699, 2.991, -87.668]}
        rotation={[0, 1.353, 0]}
        scale={[7.25, 0.125, 8.198]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.COVERED_E.geometry}
        material={materials.COLOR_PALETTE}
        position={[8.427, 2.798, -92.41]}
        rotation={[0, -0.116, 0]}
        scale={[9.383, 0.05, 1.35]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.COVERED_C.geometry}
        material={materials.COLOR_PALETTE}
        position={[-15.736, 2.798, -69.93]}
        rotation={[0, 1.353, 0]}
        scale={[9.383, 0.05, 1.35]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.EDUC_WALKWAY.geometry}
        material={materials.COLOR_PALETTE}
        position={[9.178, 4.105, -173.886]}
        rotation={[0, -0.662, 0]}
        scale={[7.605, 0.07, 1.43]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.INVISIBLE_BORDER.geometry}
        material={materials.Invisible}
        position={[-8.736, 0, -44.354]}
        rotation={[0, -0.181, 0]}
        scale={[0.421, 0.4, 1]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.OLD_CANTEEN.geometry}
        material={materials.COLOR_PALETTE}
        position={[34.974, 2.861, -72.731]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={3.2}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.PUP_BORDER.geometry}
        material={materials['Semi-White']}
        position={[-2.914, 0, -7.441]}
        rotation={[0, -0.166, 0]}
        scale={[1, 1, 0.165]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.COVERED_A.geometry}
        material={materials.COLOR_PALETTE}
        position={[-7.763, 3.356, -18.929]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[9.383, 0.05, 1.35]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.COVERED_B.geometry}
        material={materials.COLOR_PALETTE}
        position={[-7.944, 2.991, -29.235]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[7.25, 0.125, 8.198]}
      />
      <group position={[18.126, 0, -104.867]} rotation={[0, 0.025, 0]} scale={[0.4, 0.05, 0.4]}>
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.PUP_LAND_MESH.geometry}
          material={materials.COLOR_PALETTE}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.PUP_LAND_MESH_1.geometry}
          material={materials.FloorTexture}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.PUP_LAND_MESH_2.geometry}
          material={materials.GrassTexture}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.PUP_LAND_MESH_3.geometry}
          material={materials.DirtTexture}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.PUP_LAND_MESH_4.geometry}
          material={materials.DirtGrassTexture}
        />
      </group>
      <group
        position={[15.973, 0, -14.953]}
        rotation={[-Math.PI / 2, 0, 3.085]}
        scale={[-0.992, -0.44, -0.542]}>
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.FLAG_POLE_MESH.geometry}
          material={materials.COLOR_PALETTE}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.FLAG_POLE_MESH_1.geometry}
          material={materials.PH_Flag_Mat}
        />
      </group>
      <group position={[-64.098, 0, -127.749]} rotation={[-Math.PI, 1.526, -Math.PI]} scale={0.21}>
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.ENGINEERING_BUILDING_STRUCTURE_MESH.geometry}
          material={materials.COLOR_PALETTE}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.ENGINEERING_BUILDING_STRUCTURE_MESH_1.geometry}
          material={materials.Glass}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.ENGINEERING_BUILDING_STRUCTURE_MESH_2.geometry}
          material={materials.MetalStainless}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.ENGINEERING_BUILDING_STRUCTURE_MESH_3.geometry}
          material={materials.EngineeringImageTexture}
        />
      </group>
      <group position={[5.65, 0, -180.242]} rotation={[0, -0.637, 0]} scale={0.21}>
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.EDUC_BUILDING_STRUCTURE_MESH.geometry}
          material={materials.COLOR_PALETTE}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.EDUC_BUILDING_STRUCTURE_MESH_1.geometry}
          material={materials.Glass}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.EDUC_BUILDING_STRUCTURE_MESH_2.geometry}
          material={materials.TanLogoImageTexture}
        />
      </group>
      <group
        position={[18.261, 10.031, -137.24]}
        rotation={[0, 0.025, 0]}
        scale={[0.21, 0.208, 0.21]}>
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.NANTES_BUILDING_STRUCTURE_MESH.geometry}
          material={materials.COLOR_PALETTE}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.NANTES_BUILDING_STRUCTURE_MESH_1.geometry}
          material={materials.NantesImageTexture}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.NANTES_BUILDING_STRUCTURE_MESH_2.geometry}
          material={materials.Glass}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.NANTES_BUILDING_STRUCTURE_MESH_3.geometry}
          material={materials.DirtGrassTexture}
        />
      </group>
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.GRANDSTAND.geometry}
        material={materials.COLOR_PALETTE}
        position={[0.91, 3.973, -118.072]}
        rotation={[0, 0.025, 0]}
        scale={0.21}
      />
      <group
        position={[33.799, 0.074, -148.583]}
        rotation={[0, 0.178, 0]}
        scale={[0.402, 0.468, 0.76]}>
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.GYMNASIUM_MESH.geometry}
          material={materials.Glass}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.GYMNASIUM_MESH_1.geometry}
          material={materials.COLOR_PALETTE}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.GYMNASIUM_MESH_2.geometry}
          material={materials.GymnasiumImageTexture}
        />
      </group>
      <group
        position={[44.429, 0.001, -110.98]}
        rotation={[0, -0.065, 0]}
        scale={[0.19, 0.19, 0.127]}>
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.HM_ROOM_STRUCTURE_1.geometry}
          material={materials.Glass}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.HM_ROOM_STRUCTURE_2.geometry}
          material={materials.COLOR_PALETTE}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.HM_ROOM_STRUCTURE_3.geometry}
          material={materials.HMSImageTexture}
        />
      </group>
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.SHED.geometry}
        material={materials.COLOR_PALETTE}
        position={[28.767, 1.433, -82.034]}
        rotation={[-Math.PI, 1.553, -Math.PI]}
        scale={[0.6, 0.615, 1.268]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.WOOD_BUILDING.geometry}
        material={materials.COLOR_PALETTE}
        position={[-0.821, 4.523, -140.12]}
        rotation={[Math.PI / 2, -0.222, -Math.PI / 2]}
        scale={[0.432, 0.25, 0.074]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.SOLAR_POLE.geometry}
        material={materials.COLOR_PALETTE}
        position={[7.607, 1.391, -170.832]}
        rotation={[0, -0.748, 0]}
        scale={0.045}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.LIGHT_POLE2.geometry}
        material={materials.COLOR_PALETTE}
        position={[22.022, 0, -141.275]}
        rotation={[Math.PI, -1.536, Math.PI]}
        scale={0.372}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.TAMBAYAN.geometry}
        material={materials.COLOR_PALETTE}
        position={[-68.966, 0, -83.26]}
        rotation={[-Math.PI, 0, 0]}
        scale={[-0.28, -0.534, -0.993]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.LIGHT_POLE1_B_02.geometry}
        material={materials.COLOR_PALETTE}
        position={[-6.756, 0, -130.715]}
        rotation={[0, -1.567, 0]}
        scale={0.919}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.LIGHT_POLE_SINGLE1.geometry}
        material={materials.COLOR_PALETTE}
        position={[-2.461, 0, -9.579]}
        rotation={[0, Math.PI / 2, 0]}
        scale={0.919}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.LIGHT_POLE_SINGLE2.geometry}
        material={materials.COLOR_PALETTE}
        position={[-0.36, 0, -173.963]}
        rotation={[-Math.PI, 0.663, -Math.PI]}
        scale={0.919}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.LIGHT_POLE1_A_01.geometry}
        material={materials.COLOR_PALETTE}
        position={[-26.569, 0, -65.952]}
        rotation={[0, -1.567, 0]}
        scale={0.919}
      />
      <group position={[-44.075, 0, -165.647]} rotation={[0, 1.426, -Math.PI / 2]} scale={1.677}>
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.GREEN_HOUSE_MESH.geometry}
          material={materials.COLOR_PALETTE}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.GREEN_HOUSE_MESH_1.geometry}
          material={materials.NET_IMAGE_TEXTURE}
        />
      </group>
      <group
        position={[-3.741, 0, -31.203]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[2.186, 2.187, 2.187]}>
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.COMLAB2_STRUCTURE_MESH.geometry}
          material={materials.COLOR_PALETTE}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.COMLAB2_STRUCTURE_MESH_1.geometry}
          material={materials.Glass}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.COMLAB2_STRUCTURE_MESH_2.geometry}
          material={materials.ComlabImageTexture}
        />
      </group>
      <group
        position={[-13.988, 0, -17.662]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[2.186, 2.187, 2.187]}>
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.COMLAB1_STRUCTURE_MESH.geometry}
          material={materials.COLOR_PALETTE}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.COMLAB1_STRUCTURE_MESH_1.geometry}
          material={materials.Glass}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.COMLAB1_STRUCTURE_MESH_2.geometry}
          material={materials.ComlabImageTexture}
        />
      </group>
      <group position={[-27.945, 0, -44.264]} rotation={[-Math.PI, 0.769, -Math.PI]} scale={0.21}>
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.HS_BUILDING_STRUCTURE_MESH.geometry}
          material={materials.COLOR_PALETTE}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.HS_BUILDING_STRUCTURE_MESH_1.geometry}
          material={materials.TanLogoImageTexture}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.HS_BUILDING_STRUCTURE_MESH_2.geometry}
          material={materials.Glass}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.HS_BUILDING_STRUCTURE_MESH_3.geometry}
          material={materials.Invisible}
        />
      </group>
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.SHED2.geometry}
        material={materials.COLOR_PALETTE}
        position={[49.649, 0, -170.658]}
        rotation={[0, 0.059, 0]}
        scale={0.454402}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.SHED1.geometry}
        material={materials.COLOR_PALETTE}
        position={[37.461, 0, -170.234]}
        rotation={[3.082, -0.059, -0.004]}
        scale={[0.463521, 0.454402, 1.00312]}
      />
      <group position={[22.958, 0, 5.08]}>
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.ADMIN_BUILDING_STRUCTURE_MESH.geometry}
          material={materials.COLOR_PALETTE}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.ADMIN_BUILDING_STRUCTURE_MESH_1.geometry}
          material={materials.Glass}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.ADMIN_BUILDING_STRUCTURE_MESH_2.geometry}
          material={materials.AdminBuildingImageTexture}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.ADMIN_BUILDING_STRUCTURE_MESH_3.geometry}
          material={materials.DirtGrassTexture}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.ADMIN_BUILDING_STRUCTURE_MESH_4.geometry}
          material={materials.GrassTexture}
        />
      </group>
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.UMBRELLA_B_02.geometry}
        material={materials.COLOR_PALETTE}
        position={[4.059, 0, -86.741]}
        rotation={[2.76, 1.046, -2.807]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.UMBRELLA_A_01.geometry}
        material={materials.COLOR_PALETTE}
        position={[-12.165, 0, -61.547]}
        rotation={[2.945, -0.296, 3.084]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.SINK.geometry}
        material={materials.COLOR_PALETTE}
        position={[-7.084, 0, -70.393]}
        rotation={[Math.PI, -1.214, Math.PI]}
        scale={0.555}
      />
      <group position={[31.061, 0, -34.358]}>
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.YUMUL_BUILDING_STRUCTURE_MESH.geometry}
          material={materials.COLOR_PALETTE}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.YUMUL_BUILDING_STRUCTURE_MESH_1.geometry}
          material={materials.Glass}
        />
      </group>
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.TREES_A_01.geometry}
        material={materials.COLOR_PALETTE}
        position={[-12.381, 0, -28.17]}
        rotation={[2.871, 0.187, -2.511]}
        scale={0.572}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.TREES_A_03.geometry}
        material={materials.COLOR_PALETTE}
        position={[-2.896, 0, -47.585]}
        rotation={[-3.079, -1.488, -3.1]}
        scale={[2.334, 0.962, 0.964]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.TREES_A_02.geometry}
        material={materials.COLOR_PALETTE}
        position={[-6.262, 0, -39.619]}
        rotation={[-3.134, -0.841, 3.127]}
        scale={[2.334, 0.962, 0.964]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.TREES_A_05.geometry}
        material={materials.COLOR_PALETTE}
        position={[-1.838, 0, -61.455]}
        rotation={[1.899, 1.29, -1.333]}
        scale={0.572}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.TREES_A_04.geometry}
        material={materials.COLOR_PALETTE}
        position={[-0.298, 0, -55.997]}
        rotation={[-0.008, 0.872, -0.014]}
        scale={[2.334, 0.962, 0.964]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.TREES_B_01.geometry}
        material={materials.COLOR_PALETTE}
        position={[7.017, 0, -86.926]}
        rotation={[-3.079, -1.488, -3.1]}
        scale={[2.334, 0.962, 0.964]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.TREES_B_02.geometry}
        material={materials.COLOR_PALETTE}
        position={[16.742, 0, -88.062]}
        rotation={[2.175, 1.246, -1.621]}
        scale={0.572}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.TREES_B_04.geometry}
        material={materials.COLOR_PALETTE}
        position={[33.873, 0, -93.566]}
        rotation={[-3.135, -0.75, 3.126]}
        scale={[2.334, 0.962, 0.964]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.TREES_B_03.geometry}
        material={materials.COLOR_PALETTE}
        position={[26.958, 0, -89.386]}
        rotation={[2.173, -1.246, 2.777]}
        scale={0.572}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.TREES_B_05.geometry}
        material={materials.COLOR_PALETTE}
        position={[39.965, 0, -91.943]}
        rotation={[-3.079, -1.488, -3.1]}
        scale={[2.334, 0.962, 0.964]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.TREES_C_04.geometry}
        material={materials.COLOR_PALETTE}
        position={[40.326, 0, -126.632]}
        rotation={[-0.005, -0.28, -0.022]}
        scale={[2.334, 0.962, 0.964]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.TREES_C_03.geometry}
        material={materials.COLOR_PALETTE}
        position={[35.993, 0, -124.57]}
        rotation={[0.266, -0.013, 0.582]}
        scale={0.572}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.TREES_C_02.geometry}
        material={materials.COLOR_PALETTE}
        position={[30.766, 0, -125.009]}
        rotation={[-2.915, 1.548, 2.895]}
        scale={[2.334, 0.962, 0.964]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.TREES_C_01.geometry}
        material={materials.COLOR_PALETTE}
        position={[38.559, 0, -111.952]}
        rotation={[1.865, -1.293, 2.455]}
        scale={0.572}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.TREES_D_02.geometry}
        material={materials.COLOR_PALETTE}
        position={[-7.856, 0, -174.411]}
        rotation={[-0.005, -0.28, -0.022]}
        scale={[2.334, 0.962, 0.964]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.TREES_D_01.geometry}
        material={materials.COLOR_PALETTE}
        position={[-11.119, 0, -168.259]}
        rotation={[2.323, -1.203, 2.936]}
        scale={0.572}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.TREES_D_04.geometry}
        material={materials.COLOR_PALETTE}
        position={[-36.45, 0, -176.336]}
        rotation={[-3.131, -1.068, 3.131]}
        scale={[2.334, 0.962, 0.964]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.TREES_D_03.geometry}
        material={materials.COLOR_PALETTE}
        position={[-25.053, 0, -182.507]}
        rotation={[1.225, 1.288, -0.633]}
        scale={0.572}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.TREES_E_04.geometry}
        material={materials.COLOR_PALETTE}
        position={[-67.558, 0, -203.288]}
        rotation={[-0.005, -0.28, -0.022]}
        scale={[2.334, 0.962, 0.964]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.TREES_E_02.geometry}
        material={materials.COLOR_PALETTE}
        position={[-57.548, 0, -188.365]}
        rotation={[2.323, -1.203, 2.936]}
        scale={0.572}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.TREES_E_03.geometry}
        material={materials.COLOR_PALETTE}
        position={[-66.981, 0, -185.961]}
        rotation={[-3.131, -1.068, 3.131]}
        scale={[2.334, 0.962, 0.964]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.TREES_E_01.geometry}
        material={materials.COLOR_PALETTE}
        position={[-49.757, 0, -200.349]}
        rotation={[1.225, 1.288, -0.633]}
        scale={0.572}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.LIGHT_POLE1_A_04.geometry}
        material={materials.COLOR_PALETTE}
        position={[-52.808, 0, -136.297]}
        rotation={[0, -1.567, 0]}
        scale={0.919}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.LIGHT_POLE1_A_03.geometry}
        material={materials.COLOR_PALETTE}
        position={[-51.747, 0, -112.764]}
        rotation={[0, -1.567, 0]}
        scale={0.919}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.LIGHT_POLE1_A_02.geometry}
        material={materials.COLOR_PALETTE}
        position={[-48.665, 0, -88.199]}
        rotation={[0, -1.567, 0]}
        scale={0.919}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.LIGHT_POLE1_B_01.geometry}
        material={materials.COLOR_PALETTE}
        position={[-6.279, 0, -104.931]}
        rotation={[0, -1.567, 0]}
        scale={0.919}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.METAL_TANK2_MESH.geometry}
        material={materials.COLOR_PALETTE}
        position={[-1.267, 0, -130.81]}
        rotation={[Math.PI / 2, -0.222, -Math.PI / 2]}
        scale={[0.432, 0.25, 0.074]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.METAL_TANK1.geometry}
        material={materials.COLOR_PALETTE}
        position={[25.806, 0, -169.052]}
        scale={0.21}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.UMBRELLA_B_01.geometry}
        material={materials.COLOR_PALETTE}
        position={[11.08, 0, -88.096]}
        rotation={[2.76, 1.046, -2.807]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.UMBRELLA_A_03.geometry}
        material={materials.COLOR_PALETTE}
        position={[-10.46, 0, -75.438]}
        rotation={[2.945, -0.296, 3.084]}
      />
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.UMBRELLA_A_02.geometry}
        material={materials.COLOR_PALETTE}
        position={[-10.733, 0, -67.121]}
        rotation={[2.945, -0.296, 3.084]}
      />
      <group position={[-0.136, 0, -171.315]} rotation={[1.6, 0.022, 0.454]} scale={0.232}>
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.ECHO_PARK_ARC_MESH.geometry}
          material={materials.COLOR_PALETTE}
        />
        <DistanceCulledMesh
          castShadow
          receiveShadow
          geometry={nodes.ECHO_PARK_ARC_MESH_1.geometry}
          material={materials.NantesImageTexture}
        />
      </group>
      <DistanceCulledMesh
        castShadow
        receiveShadow
        geometry={nodes.COVERED_F.geometry}
        material={materials.COLOR_PALETTE}
        position={[-15.736, 2.798, -69.93]}
        rotation={[0, 1.353, 0]}
        scale={[9.383, 0.05, 1.35]}
      />
      </DistanceMeshCullProvider>
    </group>
  )
}

useGLTF.preload(MODEL_PATHS.campus)
