import { create } from "zustand";
import { SAMPLE_AVATAR_LIST } from "../sampleData";
import { Vector3 } from "three";

const useWorld = create((set) => ({
  avatar:  SAMPLE_AVATAR_LIST[0],
  characterPosition: new Vector3(0, 0, 0),
  pinPosition: null,
  selectPin: false,
  isPinConfirmed: false,
  isPinTeleported: false,
  distance: 0,
  currentZoom: 12,

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
      5,
      Math.min(50, state.currentZoom * zoomChange)
    )
  })),

}))

export default useWorld;