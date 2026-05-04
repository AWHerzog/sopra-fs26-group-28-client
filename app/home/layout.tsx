import React from "react";
import ProtectedRoute from "@/utils/protectedroutes";

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}