import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

export const socket: Socket = io(
  import.meta.env.VITE_SOCKET_URL || "http://localhost:3001",
  {
    transports: ["websocket"],
    autoConnect: true,
  }
);

export const charactersAtom = atom<any[]>([]);

export const SocketManager = () => {
  const [, setCharacters] = useAtom(charactersAtom);

  useEffect(() => {
    socket.on("players:init", (players) => {
      setCharacters(players);
    });

    socket.on("players:add", (player) => {
      setCharacters((prev) => [...prev, player]);
    });

    socket.on("player:update", ({ id, position, rotation }) => {
      setCharacters((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, position, rotation } : p
        )
      );
    });

    socket.on("players:remove", (id) => {
      setCharacters((prev) => prev.filter((p) => p.id !== id));
    });

    return () => {
      socket.off("players:init");
      socket.off("players:add");
      socket.off("player:update");
      socket.off("players:remove");
    };
  }, []);

  return null;
};

