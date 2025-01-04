"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Account() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    // Fetch and display user data here
    if (!user) {
      // Redirect to login if user is not authenticated
      router.push("/login");
    }
  });
  return <div>This is the account page.</div>;
}

export default Account;
