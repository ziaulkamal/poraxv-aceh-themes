/** src/lib/api/socket.ts — singleton socket.io-client ke gateway cms-media (real-time). */
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { API_CONFIG } from "./config";

let socket: Socket | null = null;

/**
 * Koneksi socket bersama (lazy). Reconnect otomatis; transport websocket
 * diutamakan agar latensi minimal.
 */
export function getSocket(): Socket {
  if (!socket) {
    socket = io(API_CONFIG.cmsWsUrl, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
  }
  return socket;
}

/** Putuskan & buang singleton socket (teardown / HMR). */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
