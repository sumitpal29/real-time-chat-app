"use client";
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useContext,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children?: ReactNode;
}
interface ISocketContext {
  sendMessage: (msg: string) => any;
  allMsgs: any;
}

const SockectContext = createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SockectContext);
  if (!state) throw new Error("State is not defined");

  return state;
};

export const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const [allMsgs, setAllMesgs] = useState([]);

  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg) => {
      console.log("sendMessage", msg);
      if (socket) {
        socket.emit("event:message", { message: msg });
        setAllMesgs((p) => [...p, { content: msg, isReceived: false }]);
      }
    },
    [socket]
  );

  const onMsgReceived = useCallback((msg: string) => {
    const { message } = JSON.parse(msg);
    console.log("server msg", message);
    setAllMesgs((p) => [...p, { content: message, isReceived: false }]);
  }, []);

  useEffect(() => {
    const _socket = io("http://localhost:8000");
    _socket.on("message", onMsgReceived);
    setSocket(_socket);

    return () => {
      _socket.off("message", onMsgReceived);
      _socket.disconnect();
      setSocket(undefined);
    };
  }, []);

  return (
    <SockectContext.Provider value={{ sendMessage, allMsgs }}>
      {children}
    </SockectContext.Provider>
  );
};
