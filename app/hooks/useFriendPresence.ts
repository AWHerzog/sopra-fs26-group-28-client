import { useEffect, useRef, useState } from "react";
import { ApiService } from "@/api/apiService";
import { Friend, FriendsData } from "@/types/friends";

const POLL_INTERVAL_MS = 10_000;

export function useFriendPresence(token: string) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const apiRef = useRef(new ApiService());

  useEffect(() => {
    if (!token) return;

    const fetchFriends = async () => {
      try {
        const data = await apiRef.current.get<FriendsData>("/users/friends", {
          Authorization: token,
        });
        setFriends(data.friends);
      } catch {
        // silently ignore — stale data is fine for presence
      }
    };

    fetchFriends();
    const id = setInterval(fetchFriends, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [token]);

  const onlineFriends = friends.filter((f) => f.status === "ONLINE");

  return { friends, onlineFriends };
}
