import { useEffect, useRef, useState } from "react";
import { ApiService } from "@/api/apiService";
import { GameInvite } from "@/types/invite";

const POLL_INTERVAL_MS = 4_000;

export function useGameInvites(token: string, enabled: boolean = true) {
  const [invites, setInvites] = useState<GameInvite[]>([]);
  const apiRef = useRef(new ApiService());

  useEffect(() => {
    if (!token || !enabled) {
      setInvites([]);
      return;
    }

    const fetchInvites = async () => {
      try {
        const data = await apiRef.current.get<GameInvite[]>("/invite/get", {
          Authorization: token,
        });
        setInvites(data.filter((i) => i.status === "PENDING"));
      } catch {
        // silently ignore — stale data is fine
      }
    };

    fetchInvites();
    const id = setInterval(fetchInvites, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [token, enabled]);

  return { invites };
}
