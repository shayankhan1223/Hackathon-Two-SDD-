"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken, setAuthToken } from "@/lib/api";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/sign-in");
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">AI Chat Todo</h1>
          <button
            onClick={() => {
              setAuthToken(null);
              router.push("/sign-in");
            }}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Sign Out
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}
