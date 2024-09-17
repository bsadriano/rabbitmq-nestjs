"use client";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

function useSocket() {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    if (!socket) {
      const socket = io("http://localhost:7005");

      socket.on("connect", () => {
        console.log(socket.id);
      });

      setSocket(socket);
    }

    return () => {
      socket?.disconnect();
    };
  }, [socket]);
}
