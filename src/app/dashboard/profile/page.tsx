"use client";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { z } from "zod";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const profileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
});

const ProfilePage = () => {
  const { user } = useAuth();
  const {
    profile,
    loading,
    error,
    updateProfile,
    updating,
    updateError,
    updateSuccess,
  } = useUserProfile(user?.uid);
  const [form, setForm] = useState<{ displayName: string; photoURL: string }>({
    displayName: profile?.displayName || "",
    photoURL: profile?.photoURL || "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Sync form with profile data
  // (prevents stale form on profile load)
  React.useEffect(() => {
    if (profile) {
      setForm({
        displayName: profile.displayName || "",
        photoURL: profile.photoURL || "",
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const result = profileSchema.safeParse(form);
    if (!result.success) {
      setFormError(result.error.errors[0].message);
      return;
    }
    await updateProfile(result.data);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-error">
        {error}
      </div>
    );
  }
  if (!profile) {
    return (
      <div className="p-4 bg-muted rounded-lg text-center text-muted-foreground">
        No profile found.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-card p-6 rounded-lg shadow dark:bg-surface">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="displayName"
            value={form.displayName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            autoComplete="off"
          />
        </div>
        {formError && <div className="text-error text-sm">{formError}</div>}
        {updateError && <div className="text-error text-sm">{updateError}</div>}
        {updateSuccess && (
          <div className="text-green-600 text-sm">Profile updated!</div>
        )}
        <Button
          type="submit"
          loading={updating}
          disabled={updating}
          className="w-full"
        >
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default ProfilePage;
