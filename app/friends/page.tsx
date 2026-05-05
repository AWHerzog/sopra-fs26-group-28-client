"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useSessionStorage from "@/hooks/useSessionStorage";
import { Button, Space, Spin } from "antd";
import { TeamOutlined, ArrowLeftOutlined, ReloadOutlined } from "@ant-design/icons";
import { Friend, FriendRequest, FriendsData } from "@/types/friends";
import styles from "./friends.module.css";

const FriendsPage: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const { value: token } = useSessionStorage<string>("token", "");
  const [data, setData] = useState<FriendsData | null>(null);
  const [loading, setLoading] = useState(false);

  const loadFriends = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const payload = await apiService.get<FriendsData>("/users/friends", {
        Authorization: token,
      });
      setData(payload);
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFriends();
  }, [token]);

  const renderFriendRow = (friend: Friend) => {
    return (
      <div className={styles.listItem} key={friend.id}>
        <div className={styles.listItemContent}>
          <span className={styles.username}>{friend.username}</span>
          <span className={styles.statusText}>Status: {friend.status}</span>
        </div>
        <span className={`${styles.badge} ${friend.status === "ONLINE" ? styles.badgeOnline : styles.badgeOffline}`}>
          {friend.status}
        </span>
      </div>
    );
  };

  const renderRequestRow = (request: FriendRequest) => {
    return (
      <div className={styles.listItem} key={request.id}>
        <div className={styles.listItemContent}>
          <span className={styles.username}>{request.senderUsername}</span>
          <span className={styles.statusText}>Requested on {new Date(request.createdAt).toLocaleDateString()}</span>
        </div>
        <span className={`${styles.badge} ${styles.badgePending}`}>Pending</span>
      </div>
    );
  };

  return (
    <div className={styles.friendsPage}>
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Friends</h2>
            <p className={styles.sectionDescription}>Your current friends list. Refresh to get the latest state from the server.</p>
          </div>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
              Back
            </Button>
            <Button icon={<ReloadOutlined />} type="primary" onClick={loadFriends} loading={loading}>
              Refresh
            </Button>
          </Space>
        </div>

        {loading && (
          <div className={styles.emptyState}>
            <Spin tip="Loading friends..." />
          </div>
        )}

        {!loading && (!data || data.friends.length === 0) && (
          <div className={styles.emptyState}>
            <p>No friends yet.</p>
          </div>
        )}

        {!loading && data?.friends && data.friends.length > 0 && (
          <div className={styles.friendList}>
            {data.friends.map((friend) => renderFriendRow(friend))}
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

        {!loading && (!data || data.incomingRequests.length === 0) && (
          <div className={styles.emptyState}>
            <p>No pending requests.</p>
          </div>
        )}

        {!loading && data?.incomingRequests && data.incomingRequests.length > 0 && (
          <div className={styles.requestList}>
            {data.incomingRequests.map((request) => renderRequestRow(request))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
