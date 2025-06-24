"use client";

import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import {
  User,
  UserProfile,
  AuthState,
  LoginFormData,
  SignupFormData,
} from "@/lib/types";
import { getErrorMessage } from "@/lib/utils";

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user profile from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          const userData = userDoc.data() as UserProfile;

          const user: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName:
              firebaseUser.displayName || userData?.displayName || "User",
            photoURL: firebaseUser.photoURL || userData?.photoURL,
            createdAt: userData?.createdAt || new Date(),
          };

          setAuthState({
            user,
            loading: false,
            error: null,
          });
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setAuthState({
            user: null,
            loading: false,
            error: getErrorMessage(error),
          });
        }
      } else {
        setAuthState({
          user: null,
          loading: false,
          error: null,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (data: LoginFormData) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: getErrorMessage(error),
      }));
      throw error;
    }
  };

  const signup = async (data: SignupFormData) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Update display name
      await updateProfile(firebaseUser, {
        displayName: data.displayName,
      });

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: data.displayName,
        photoURL: firebaseUser.photoURL || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, "users", firebaseUser.uid), userProfile);
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: getErrorMessage(error),
      }));
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const provider = new GoogleAuthProvider();
      const { user: firebaseUser } = await signInWithPopup(auth, provider);

      // Check if user profile exists, if not create one
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

      if (!userDoc.exists()) {
        const userProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || "User",
          photoURL: firebaseUser.photoURL || "",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await setDoc(doc(db, "users", firebaseUser.uid), userProfile);
      }
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: getErrorMessage(error),
      }));
      throw error;
    }
  };

  const logout = async () => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      await signOut(auth);
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: getErrorMessage(error),
      }));
      throw error;
    }
  };

  const clearError = () => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  return {
    ...authState,
    login,
    signup,
    loginWithGoogle,
    logout,
    clearError,
  };
};
