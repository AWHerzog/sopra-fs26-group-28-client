# App Structure and Route Flow

This file documents the important frontend files inside `app/` and how the current/future game flow routes are connected.

## Route Flow (Game)

User flow:

1. `/game`
2. `/game/answer`
3. `/game/waiting`
4. `/game/voting`
5. `/game/solution`
6. (optional loop) back to `/game/answer`

## Route Responsibilities

- `game/page.tsx`: Hub page with cards linking to each game stage.
- `game/answer/page.tsx`: Wrapper route that renders the shared stage component in `answer` mode.
- `game/waiting/page.tsx`: Wrapper route for waiting state.
- `game/voting/page.tsx`: Wrapper route for voting state.
- `game/solution/page.tsx`: Wrapper route for reveal/solution state.

The stage routes are intentionally lightweight and pass props into one shared component.

## Shared Game View Layer

- `game/_components/GameStageView.tsx`
	- Main shared UI and logic for all game stages.
	- Handles stage-specific rendering (`answer`, `waiting`, `voting`, `solution`).
	- Keeps local state for typed answer and selected vote.
	- Randomizes answer order for voting/solution display.

- `game/_data.ts`
	- Temporary mock data for question, answers, and waiting progress.
	- Designed as a backend placeholder so API integration can be added later.

- `game/game.module.css`
	- Shared styles for all game views and the game hub page.

## App-Wide Important Files

- `layout.tsx`
	- Global layout provider (Ant Design config/theme, registry wrapper).

- `styles/globals.css`
	- Global style tokens and shared base styles.

- `api/apiService.ts`
	- Generic HTTP helper used by pages for backend requests.

- `api/websocket.ts`
	- WebSocket/STOMP connection helpers for game updates.

- `types/game.ts`
	- Type used for game objects exchanged with backend/websocket.

- `types/stompjs.d.ts`, `types/sockjs-client.d.ts`
	- Local module declarations for websocket-related packages.

## Existing Non-Game Routes

- `/` -> `page.tsx`
- `/login` -> `login/page.tsx`
- `/register` -> `register/page.tsx`
- `/index` -> `index/page.tsx` (wraps `index/IndexDashboard.tsx`)
- `/index/[id]` -> `index/[id]/page.tsx`
- `/users` -> `users/page.tsx`
- `/users/[id]` -> `users/[id]/page.tsx`

## Integration Notes

- To plug in backend logic later, replace values from `game/_data.ts` with data from API/WebSocket.
- Keep `GameStageView.tsx` as the shared rendering layer and move network/state orchestration into a parent container when needed.
