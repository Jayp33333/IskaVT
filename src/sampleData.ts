export const IS_DEV = !import.meta.env.VITE_VIVERSE_APP_ID;

export const SAMPLE_AVATAR_LIST = IS_DEV
  ? [
      {
        headIconUrl:
          "https://avatar.viverse.com/api/meetingareaselector/v2/newgenavatar/avatars/408f3f59f9c088b2e5c1634ffb35fec3ad18ca294ef2e5eb6f418409a3f239ec294c/files?filetype=headicon",
        id: 184175,
        vrmUrl:
          "https://avatar.viverse.com/api/meetingareaselector/v2/newgenavatar/avatars/408f3f59f9c088b2e5c1634ffb35fec3ad18ca294ef2e5eb6f418409a3f239ec294c/files?filetype=model&lod=original",
      },

      {
        headIconUrl:
          "https://avatar.viverse.com/api/meetingareaselector/v2/newgenavatar/avatars/5c6b8578078c8e94f6361db9add7f541556c3dafdf3ff70c5fc99cbdc90116b865c1/files?filetype=headicon",
        id: 184207,
        vrmUrl:
          "https://avatar.viverse.com/api/meetingareaselector/v2/newgenavatar/avatars/5c6b8578078c8e94f6361db9add7f541556c3dafdf3ff70c5fc99cbdc90116b865c1/files?filetype=model&lod=original",
      },
    ]
  : [
      {
        headIconUrl:
          "https://avatar.viverse.com/api/meetingareaselector/v2/newgenavatar/avatars/408f3f59f9c088b2e5c1634ffb35fec3ad18ca294ef2e5eb6f418409a3f239ec294c/files?filetype=headicon",
        id: 184175,
        vrmUrl:
          "https://avatar.viverse.com/api/meetingareaselector/v2/newgenavatar/avatars/408f3f59f9c088b2e5c1634ffb35fec3ad18ca294ef2e5eb6f418409a3f239ec294c/files?filetype=model&lod=original",
      },
    ];
