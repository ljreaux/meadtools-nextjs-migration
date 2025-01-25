"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import { useAuth } from "@/components/providers/AuthProvider";
import { ReactNode } from "react";

function Account({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!isLoggedIn) {
      timeout = setTimeout(() => {
        router.push("/login");
      }, 3000);
    } else {
      setIsChecking(false);
    }

    return () => clearTimeout(timeout);
  }, [isLoggedIn, router]);

  if (isChecking || !isLoggedIn) {
    return <Loading />;
  }

  return (
    <div className="w-full flex flex-col justify-center items-center py-[6rem] relative">
      {children}
    </div>
  );
}

export default Account;
