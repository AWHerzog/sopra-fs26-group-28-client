export interface Friend {
  id: string;
  senderUsername: string; //this will always be the current User
  receiverUsername: string; //this is his friend
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
