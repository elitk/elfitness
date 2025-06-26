"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { SettingsProvider } from "@/context/SettingsContext";

const HomePage: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/dashboard");
      } else {
        router.push("/auth/login");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <SettingsProvider>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-text-secondary">Loading...</p>
          </div>
        </div>
      </SettingsProvider>
    );
  }

  return null; // Will redirect
};

export default HomePage;
