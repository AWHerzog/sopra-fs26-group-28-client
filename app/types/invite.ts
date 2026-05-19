export interface GameInvite {
  id: number;
  senderUsername: string;
  gameCode: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
}
