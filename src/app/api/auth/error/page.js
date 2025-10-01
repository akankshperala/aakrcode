"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const error = searchParams.get("error");

  useEffect(() => {
    if (error === "NEW_USER") {
      // redirect to register page with message
      router.push("/api/auth?message=Please+register+first");
    }
  }, [error, router]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {error ? (
        <p style={{ color: "red", fontWeight: "bold" }}>
          {error === "NEW_USER"
            ? "Redirecting you to register..."
            : `Authentication error: ${error}`}
        </p>
      ) : (
        <p>Unknown authentication error.</p>
      )}
    </div>
  );
}
