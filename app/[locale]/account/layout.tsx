"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

function Account({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  });
  return (
    <div className="w-full flex flex-col justify-center items-center py-[6rem] relative">
      {children}
    </div>
  );
}

export default Account;
