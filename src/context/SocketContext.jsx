import { createContext, useContext } from "react";

// SocketContext holds the shared Socket.IO client instance for the entire React app.
// This avoids creating multiple socket connections across different pages or components.
// Components can read the same socket using the useSocket() hook.
export const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};
