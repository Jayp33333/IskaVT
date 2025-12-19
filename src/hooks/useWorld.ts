import { create } from "zustand";
import { SAMPLE_AVATAR_LIST } from "../sampleData";
import { Vector3 } from "three";

const useWorld = create((set) => ({
  avatar:  SAMPLE_AVATAR_LIST[0],
  characterPosition: new Vector3(0, 0, 0),
  pinPosition: null,
  selectPin: true,
  isPinConfirmed: false,
  isPinTeleported: false,
  distance: 0,
  currentZoom: 100,
  cameraRotation: new Vector3(0, 0, 0), 

  setAvatar: (avatar: any) => set({ avatar }),
  setCharacterPosition: (characterPosition: Vector3) => set({ characterPosition}),
  setPinPosition: (pinPosition: Vector3) => set({ pinPosition }),
  setSelectPin: (selectPin: boolean) => set({ selectPin }),
  setIsPinConfirmed: (isPinConfirmed: boolean) => set({ isPinConfirmed }),
  setIsPinTeleported: (isPinTeleported: boolean) => set({ isPinTeleported }),
  setDistance: (distance: number) => set({ distance }),
  setCurrentZoom: (zoomChange: number) =>
  set((state: any) => ({
    currentZoom: Math.max(
      19,
      Math.min(100, state.currentZoom * zoomChange)
    )
  })),
  setCameraRotation: (cameraRotation: Vector3) => set({ cameraRotation }),

}))

export default useWorld;