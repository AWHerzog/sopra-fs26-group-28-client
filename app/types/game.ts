

export interface Game {
  id: string | null;
  hostname: string | null;
  code: string | null;
  status: string | null;
  players: { [username: string]: number } | null;
}
