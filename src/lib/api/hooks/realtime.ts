/**
 * src/lib/api/hooks/realtime.ts — jembatan socket.io cms → invalidasi React Query.
 * Pasang sekali (AppLayout). Aktif hanya bila VITE_CMS_WS_URL diset (gateway tersedia).
 */
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { API_CONFIG } from "../config";
import { getSocket } from "../socket";
import { qk } from "../queryKeys";

/** Dengar event gateway cms → invalidate query terkait (skor/klasemen/siaran). */
export function useRealtimeSync(): void {
  const qc = useQueryClient();
  useEffect(() => {
    if (!API_CONFIG.wsEnabled) return;
    const socket = getSocket();

    // Gateway cms hanya emit ke room; tanpa join klien tak menerima apa pun.
    const joinRooms = () => {
      socket.emit("subscribe", "live-scores");
      socket.emit("subscribe", "standings");
      socket.emit("subscribe", "streaming");
    };
    socket.on("connect", joinRooms);
    if (socket.connected) joinRooms();

    const invalidasiSkor = () => qc.invalidateQueries({ queryKey: qk.liveSkor });
    const invalidasiKlasemen = () => qc.invalidateQueries({ queryKey: qk.klasemen });
    const invalidasiSiaran = () => qc.invalidateQueries({ queryKey: qk.streaming });
    // Status berubah → segarkan jadwal (laga selesai keluar dari homepage).
    const invalidasiStatus = () => {
      invalidasiSkor();
      qc.invalidateQueries({ queryKey: ["jadwal"] });
    };

    socket.on("match.score.updated", invalidasiSkor);
    socket.on("match.status.updated", invalidasiStatus);
    socket.on("leaderboard.updated", invalidasiKlasemen);
    socket.on("streaming.toggled", invalidasiSiaran);
    socket.on("stream.updated", invalidasiSiaran);
    socket.on("stream.viewers", invalidasiSiaran);

    return () => {
      socket.off("connect", joinRooms);
      socket.off("match.score.updated", invalidasiSkor);
      socket.off("match.status.updated", invalidasiStatus);
      socket.off("leaderboard.updated", invalidasiKlasemen);
      socket.off("streaming.toggled", invalidasiSiaran);
      socket.off("stream.updated", invalidasiSiaran);
      socket.off("stream.viewers", invalidasiSiaran);
    };
  }, [qc]);
}
