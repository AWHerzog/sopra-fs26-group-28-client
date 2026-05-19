"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useSessionStorage from "@/hooks/useSessionStorage";
import { useFriendPresence } from "@/hooks/useFriendPresence";
import { Button, Input, Space, Spin, message } from "antd";
import { TeamOutlined, ArrowLeftOutlined, ReloadOutlined, UserAddOutlined } from "@ant-design/icons";
import { Friend, FriendRequest, FriendsData } from "@/types/friends";
import styles from "./friends.module.css";

const FriendsPage: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const { value: token } = useSessionStorage<string>("token", "");
  const { friends } = useFriendPresence(token);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingIds, setActionLoadingIds] = useState<Set<string>>(new Set());
  const [sendUsername, setSendUsername] = useState("");
  const [sending, setSending] = useState(false);

  const loadRequests = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const payload = await apiService.get<FriendsData>("/users/friends", {
        Authorization: token,
      });
      setRequests(payload.incomingRequests.filter((r) => r.status === "PENDING"));
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const setActionLoading = (id: string, active: boolean) => {
    setActionLoadingIds((prev) => {
      const next = new Set(prev);
      if (active) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleAccept = async (requestId: string) => {
    if (!token) return;
    setActionLoading(requestId, true);
    try {
      await apiService.post<void>(`/users/friends/requests/${requestId}/accept`, {}, {
        Authorization: token,
      });
      await loadRequests();
    } catch (error) {
      console.error("Accept failed:", error);
    } finally {
      setActionLoading(requestId, false);
    }
  };

  const handleDecline = async (requestId: string) => {
    if (!token) return;
    setActionLoading(requestId, true);
    try {
      await apiService.post<void>(`/users/friends/requests/${requestId}/decline`, {}, {
        Authorization: token,
      });
      await loadRequests();
    } catch (error) {
      console.error("Decline failed:", error);
    } finally {
      setActionLoading(requestId, false);
    }
  };

  const handleSendFriendRequest = async () => {
    if (!token || !sendUsername.trim()) return;
    setSending(true);
    try {
      await apiService.post<void>("/users/friends/requests", { username: sendUsername.trim() }, {
        Authorization: token,
      });
      setSendUsername("");
      message.success(`Friend request sent to ${sendUsername.trim()}!`);
      await loadRequests();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Could not send friend request.";
      message.error(msg);
    } finally {
      setSending(false);
    }
  };

  const handleRemove = async (friendId: string) => {
    if (!token) return;
    setActionLoading(friendId, true);
    try {
      await apiService.delete<void>(`/users/friends/${friendId}`, {
        Authorization: token,
      });
    } catch (error) {
      console.error("Remove failed:", error);
    } finally {
      setActionLoading(friendId, false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [token]);

  const renderFriendRow = (friend: Friend) => {
    const busy = actionLoadingIds.has(friend.id);
    return (
      <div className={styles.listItem} key={friend.id}>
        <div className={styles.listItemContent}>
          <span className={styles.username}>{friend.receiverUsername}</span>
          <span className={styles.statusText}>Status: {friend.status}</span>
        </div>
        <div className={styles.listItemActions}>
          <span className={`${styles.badge} ${friend.status === "ONLINE" ? styles.badgeOnline : styles.badgeOffline}`}>
            {friend.status}
          </span>
          <Button type="default" danger onClick={() => handleRemove(friend.id)} loading={busy}>
            Remove
          </Button>
        </div>
      </div>
    );
  };

  const renderRequestRow = (request: FriendRequest) => {
    const busy = actionLoadingIds.has(request.id);
    return (
      <div className={styles.listItem} key={request.id}>
        <div className={styles.listItemContent}>
          <span className={styles.username}>{request.senderUsername}</span>
          <span className={styles.statusText}>Requested on {new Date(request.createdAt).toLocaleDateString()}</span>
        </div>
        <div className={styles.listItemActions}>
          <span className={`${styles.badge} ${styles.badgePending}`}>Pending</span>
          <Space>
            <Button type="primary" onClick={() => handleAccept(request.id)} loading={busy}>
              Accept
            </Button>
            <Button danger onClick={() => handleDecline(request.id)} loading={busy}>
              Decline
            </Button>
          </Space>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.friendsPage}>
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Add Friend</h2>
            <p className={styles.sectionDescription}>Send a friend request by username.</p>
          </div>
          <UserAddOutlined style={{ fontSize: 24, color: "#2f74b5" }} />
        </div>
        <Space.Compact style={{ width: "100%" }}>
          <Input
            placeholder="Enter username"
            value={sendUsername}
            onChange={(e) => setSendUsername(e.target.value)}
            onPressEnter={handleSendFriendRequest}
          />
          <Button type="primary" onClick={handleSendFriendRequest} loading={sending}>
            Send
          </Button>
        </Space.Compact>
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Friends</h2>
            <p className={styles.sectionDescription}>Status updates automatically every 10 seconds.</p>
          </div>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
              Back
            </Button>
            <Button icon={<ReloadOutlined />} type="primary" onClick={loadRequests} loading={loading}>
              Refresh
            </Button>
          </Space>
        </div>

        {friends.length === 0 && (
          <div className={styles.emptyState}>
            <p>No friends yet.</p>
          </div>
        )}

        {friends.length > 0 && (
          <div className={styles.friendList}>
            {friends.map((friend) => renderFriendRow(friend))}
          </div>
        )}
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Request Inbox</h2>
            <p className={styles.sectionDescription}>Incoming friend requests are shown here so you can review them later.</p>
          </div>
          <TeamOutlined style={{ fontSize: 24, color: "#2f74b5" }} />
        </div>

        {loading && (
          <div className={styles.emptyState}>
            <Spin tip="Loading..." />
          </div>
        )}

        {!loading && requests.length === 0 && (
          <div className={styles.emptyState}>
            <p>No pending requests.</p>
          </div>
        )}

        {!loading && requests.length > 0 && (
          <div className={styles.requestList}>
            {requests.map((request) => renderRequestRow(request))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
