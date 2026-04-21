# Contributions

Every member has to complete at least 2 meaningful tasks per week, where a
single development task should have a granularity of 0.5-1 day. The completed
tasks have to be shown in the weekly TA meetings. You have one "Joker" to miss
one weekly TA meeting and another "Joker" to once skip continuous progress over
the remaining weeks of the course. Please note that you cannot make up for
"missed" continuous progress, but you can "work ahead" by completing twice the
amount of work in one week to skip progress on a subsequent week without using
your "Joker". Please communicate your planning **ahead of time**.

Note: If a team member fails to show continuous progress after using their
Joker, they will individually fail the overall course (unless there is a valid
reason).

**You MUST**:

- Have two meaningful contributions per week.

**You CAN**:

- Have more than one commit per contribution.
- Have more than two contributions per week.
- Link issues to contributions descriptions for better traceability.

**You CANNOT**:

- Link the same commit more than once.
- Use a commit authored by another GitHub user.

---

## Contributions Week 1 - [23.03.26] to [1.04.26]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
|  **[EneasKe]** | 28.03.26   | [https://github.com/AWHerzog/sopra-fs26-group-28-server/commit/ed23750563cfc7be9c1d2464e964936a79fd67f1] | [#17, #18 Implemented User entity and changed Tests to work with this new Entity (REST, etc.) made sure backend runs (4h)] | [User Entity is important because we will Use this entity for a lot of things like login, points etc.] |
|                    | 28.03.26 & 30.03.26  | [https://github.com/AWHerzog/sopra-fs26-group-28-server/issues/1] | [Multiple commits, commit #19, #20, #21 and User Story 1 completed. Implemented endpoints for login and registration and created helper function for password hashing, also made sure frontend created by Ruven and backend work together (Additionally made sure token logic works) 6h] | [This is necessary for the client to create an account and login] |
| **[Ruven3344**] | 30.03.2026   | [https://github.com/AWHerzog/sopra-fs26-group-28-client/commit/45daf654e5ddb1c0e2252420c12eab6f0e27e423] | [2 Contributions in 1 commit: Implementation of Login and Registration Frontend (3h), conntected to API (0.5 h), global and local .css file for styling (4h)] | [global and local styling files allow for less code dublication and fewer inconsistencies, frontend pages allow user to interact with the application] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[Luizcodes02]** | 31.03.26   | [https://github.com/AWHerzog/sopra-fs26-group-28-client/pull/20/changes/b93e25ac78b68d7375247f291ef7872b1c2f0aa7] | [Create main overview page with create session button] | [central entry point] |
|                    | [31.03.26]   | [(https://github.com/AWHerzog/sopra-fs26-group-28-client/pull/21/changes/e1c0c9bcb1e2b08bee8afeb75e5725aa2bac60c6)] | [add logout button] | [logout functionality for switching accounts] |
| **[@AWHerzog]** | [31.3.26]   | [https://github.com/AWHerzog/sopra-fs26-group-28-server/pull/65] | Created backend rest implenetation to get/edit user by their assigned id | So Users/id can be parsed |
|                    | [27/30.3.26]   | - | Redid the entire Scrum setup, created new tasks and managed the old ones. 5/6 hours | So we could begin working and have a better overview of how we wanted to approach this project |

---

## Contributions Week 2 - [1.04.26] to [15.04.26]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **[EneasKe]** | [05.04.26]   | [(https://github.com/AWHerzog/sopra-fs26-group-28-server/commit/3b5f3183343229b739a6e41385bd4e7299624f51)] | [Finished WebSocket setup and setting up a Lobby 8h] | [WebSockets allow us to "subscribe" to a certain topic and then get information everytime something changes to all subscribed players, very important for a game relying on real time inputs] |
|                    | [13.04.26]   | [https://github.com/AWHerzog/sopra-fs26-group-28-server/commit/eee4ff79e6ddcdd24e6bbf1d6f30ad81e75228bd + https://github.com/AWHerzog/sopra-fs26-group-28-client/commit/63758317ad5b65e57b0259d8919e0fc952205892] | [Implemented frontend and backend auth guard, currently session taken based, with localStorage and Authorization header sent in REST calls 4h] | [Makes sure users cannot access content they are not supposed to] |
| **[AWHerzog]** | [09.04.26]   | [https://github.com/AWHerzog/sopra-fs26-group-28-server/pull/70] | [Game code validation, error handling, and unit tests (5h)] | [Players can join game session and validate validity of session] |
|                    | [14.04.26]   | [https://github.com/AWHerzog/sopra-fs26-group-28-server/pull/82] | [4 tests covering create and join game endpoints] | [Ensures the game controller correctly handles HTTP requests and returns correct status codes 3h] |
| **[Ruven3344]** | [08.04.2026]   | [[Link to Commit 1](https://github.com/AWHerzog/sopra-fs26-group-28-client/commit/649f9ad7c8ba0d88256195529398fcf4e70de400)] | [write markdown with existing flow paths as well as plan future file structure of different pages inside game (3h)] | [gaining overview and planing for frontend implementation of game stages, making design decisions] |
|                    | [11.04.2026]   | [https://github.com/AWHerzog/sopra-fs26-group-28-client/commit/f3a4a1e05214536c6f6fe4b2ebe7ee2c7e66a249] | [Created Frontend pages for pages inside a game round (enter, wait, vote, solution), score not implemented! Currently with demo data/placeholders for connection with backend later, loclahost:3000/game contains overview menu to navigate easily between created pages, still produces some minor bugs, will come back to this as soon as connected to backend. (6 hours)] | [Creates base for all needed needed services/endpoints of backend, sets structure of game flows] |
| **[luizcodes02]** | [13.04.2026]   | [[Link to Commit 1](https://github.com/AWHerzog/sopra-fs26-group-28-client/pull/36/changes/97510eee0f0cc77f5ae1de0e4baff6425e6ad7e6)] | [Redesigned /index with a clean “Choose Game Mode” UI (Join/Host, action icons, hint bar).] | [Central hub after login for hosting or joining games which improves usability and sets UI standard. Also fixed Vercel deployment by resolving TypeScript lint issues.] |
|                    | [14.04.2026]   | [[Link to Commit 2](https://github.com/AWHerzog/sopra-fs26-group-28-client/pull/36/changes/984ade0c5cd5e3f17100db691b0f3ede6cc2349e)] | [Redesigned the in-game lobby with prominent game code + copy, player list with avatars and status, and Start (host) / Leave actions.] | [First shared multiplayer screen showing players and readiness which is essential for game flow. Designed to plug directly into WebSocket state with mininal backend work.] |

---

## Contributions Week 3 - [Begin Date] to [End Date]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **[@AWHerzog]**   |   [15.4.26]   | [https://github.com/AWHerzog/sopra-fs26-group-28-server/commit/2e2d0b0792549e8c0b6808d8cc7a70a38f1adb02] | [Created the core logic of the game in the backend] | [Important so the frontend can implement the design aspect of the game. Otherwise quite self explanatory] |
|                    | [15.4.26]   | [https://github.com/AWHerzog/sopra-fs26-group-28-server/commit/6ae809b152e203ff14e72db5305a45bb356175ca] | [Created a Json file with questions and handler] | [To display questions and avoid duplicates in a game] |
| **[EneasKe]** | [16.04.26]   | [https://github.com/AWHerzog/sopra-fs26-group-28-server/commit/7915e16a90c9b6a9608bb71d64d6dc3af7f7a304 + https://github.com/AWHerzog/sopra-fs26-group-28-client/commit/9242e6ef919fd8d7b97bb05a0c115403b3e14b27] | [Exposed REST endpoints for gameflow and started working on the flow itself 5h] | [The game is the core of our app, important that it works] |
|                    | [21.04.26]   | [https://github.com/AWHerzog/sopra-fs26-group-28-server/commit/1850b1651e8a3c7b6178d627b6d3ca90abe143e8 + https://github.com/AWHerzog/sopra-fs26-group-28-client/commit/5cb79fa6adc61f7907b59194b7af495b1cfd9f5d] | [Fixed Bugs especially showing waiting correct, hosting more than one game, leaving etc. clean up frontend 4h] | [Make Sure game does not break easily, clean up frontend to make game appear finished] |
| **[Luizcodes02]** | [19.04.26]   | [https://github.com/AWHerzog/sopra-fs26-group-28-server/commit/6a5802d9ee5b806f16007c215850ba152a556921] | [Fix QuestionService import, add question/answers to game state, add advance endpoint] | [Game state receives questions/answers from backend] |
|                    | [20.04.26]   | [https://github.com/AWHerzog/sopra-fs26-group-28-server/commit/7487cabb8ec76f46915098ecb83d8ae9220d6b9d] | [Fix race condition with pessimistic lock, add correct answer as voting option] | [race condition fix and correct answer gets shown] |
| **[@githubUser4]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |

---

## Contributions Week 4 - [Begin Date] to [End Date]

_Continue with the same table format as above._

---

## Contributions Week 5 - [Begin Date] to [End Date]

_Continue with the same table format as above._

---

## Contributions Week 6 - [Begin Date] to [End Date]

_Continue with the same table format as above._
