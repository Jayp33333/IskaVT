import { useState } from "react";
import { useViverseAvatarList } from "@react-three/viverse";
import useWorld from "../../../hooks/useWorld";
import { SAMPLE_AVATAR_LIST } from "../../../sampleData";

export const AvatarPicker = () => {
  const avatarList = useViverseAvatarList() || SAMPLE_AVATAR_LIST;

  const currentAvatar = useWorld((state: any) => state.avatar);
  const setAvatar = useWorld((state: any) => state.setAvatar);

  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className="relative">
      {/* Current Avatar Button */}
      <button
        className="rounded-lg border-2 border-white overflow-hidden cursor-pointer focus:outline-none bg-black/60"
        style={{
          width: "clamp(48px, 8vw, 64px)",
          height: "clamp(48px, 8vw, 64px)",
        }}
        onClick={() => setOpenMenu(!openMenu)}
      >
        <img
          src={currentAvatar.headIconUrl}
          alt="Current Avatar"
          className="w-full h-full object-cover"
        />
      </button>

      {/* Avatar List Panel */}
      {openMenu && (
        <div
          className="absolute top-[75px] left-0 z-999 bg-black/85 p-2.5 rounded-lg grid shadow-lg"
          style={{
            gridTemplateColumns: `repeat(2, clamp(48px, 8vw, 64px))`,
            gap: "clamp(8px, 1.5vw, 10px)",
          }}
        >
          {avatarList.map((a) => {
            const isSelected = currentAvatar.id === a.id;
            return (
              <button
                key={a.id}
                onClick={() => {
                  setAvatar(a);
                  setOpenMenu(false);
                }}
                className={`rounded-md overflow-hidden border transition-colors duration-200`}
                style={{
                  width: "clamp(36px, 8vw, 48px)",
                  height: "clamp(36px, 8vw, 48px)",
                  borderColor: isSelected ? "#facc15" : "#4b5563",
                }}
              >
                <img
                  src={a.headIconUrl}
                  alt={"Avatar"}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
