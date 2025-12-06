import { useViverseAvatarList } from "@react-three/viverse";
import useWorld from "../../hooks/useWorld";
import { SAMPLE_AVATAR_LIST } from "../../sampleData";

export const AvatarPicker = () => {
  const avatarList = useViverseAvatarList() || SAMPLE_AVATAR_LIST;
  console.log("Avatar List", avatarList);

  // const avatar = useWorld((state: any) => state.avatar);
  const setAvatar = useWorld((state: any) => state.setAvatar);

  return avatarList.map((avatarData) => (
    <div key={avatarData.id} style={{
      width: '64px',
      height: '64px',
      margin: '4px'
    }}
    onClick={() => setAvatar(avatarData)}
    >
      
      <img src={avatarData.headIconUrl} style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }} />
    </div>
  ));
};
