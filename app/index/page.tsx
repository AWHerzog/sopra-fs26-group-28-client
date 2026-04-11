// this code is part of S2 to display a list of all registered users
// clicking on a user in this list will display /app/users/[id]/page.tsx
import Dashboard from "./IndexDashboard";

export const dynamic = "force-dynamic";

export default function IndexPage() {
  return <Dashboard />;
}
