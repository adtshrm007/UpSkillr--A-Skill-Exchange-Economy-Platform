import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/Auth.context.jsx";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

let globalSocket = null;
let subscribers = 0;

export function useSocket() {
  const { user } = useAuth();
  const [connected, setConnected] = useState(globalSocket?.connected || false);

  useEffect(() => {
    if (!user) return;

    if (!globalSocket) {
      globalSocket = io(SOCKET_URL, { withCredentials: true, transports: ["websocket"] });
    }
    subscribers++;

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    globalSocket.on("connect", onConnect);
    globalSocket.on("disconnect", onDisconnect);
    setConnected(globalSocket.connected);

    return () => {
      globalSocket.off("connect", onConnect);
      globalSocket.off("disconnect", onDisconnect);
      subscribers--;
      if (subscribers === 0) {
        globalSocket.disconnect();
        globalSocket = null;
      }
    };
  }, [user]);

  const on = (event, handler) => {
    globalSocket?.on(event, handler);
    return () => globalSocket?.off(event, handler);
  };

  return { socket: globalSocket, connected, on };
}
