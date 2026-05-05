export interface Friend {
  id: string;
  username: string;
  status: string;
  lastSeen?: string;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  senderUsername: string;
  receiverId: string;
  createdAt: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
}

export interface FriendsData {
  friends: Friend[];
  incomingRequests: FriendRequest[];
  outgoingRequests: FriendRequest[];
}
