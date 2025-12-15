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
    <div style={{ position: "relative" }}>
      {/* CURRENT AVATAR BUTTON */}
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "10px",
          border: "2px solid white",
          overflow: "hidden",
          cursor: "pointer",
        }}
        onClick={() => setOpenMenu(!openMenu)}
      >
        <img
          src={currentAvatar.headIconUrl}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* AVATAR LIST PANEL */}
      {openMenu && (
        <div
          style={{
            position: "absolute",
            top: "75px",
            left: 0,
            background: "rgba(0,0,0,0.85)",
            padding: "10px",
            borderRadius: "10px",
            display: "grid",
            gridTemplateColumns: "repeat(3, 64px)",
            gap: "10px",
            zIndex: 999,
          }}
        >
          {avatarList.map((a) => (
            <div
              key={a.id}
              onClick={() => {
                setAvatar(a);
                setOpenMenu(false);
              }}
              style={{
                width: "64px",
                height: "64px",
                cursor: "pointer",
                borderRadius: "8px",
                overflow: "hidden",
                border:
                  currentAvatar.id === a.id
                    ? "2px solid #FFD700"
                    : "1px solid #555",
              }}
            >
              <img
                src={a.headIconUrl}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
