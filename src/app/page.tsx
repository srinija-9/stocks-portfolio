"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <div>
      <p className="pt-10">Redirecting to Dashboard...</p>
    </div>
  );
};

export default Page;
