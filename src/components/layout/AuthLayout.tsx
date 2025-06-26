"use client";

import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-background dark:text-text-primary mb-2">
            Elfitness
          </h1>
          <p className="text-text-secondary dark:text-text-primary">
            Your AI-powered fitness companion
          </p>
        </div>

        {children}
        <div className="mt-8 text-center">
          <p className="text-xs text-text-secondary dark:text-text-primary">
            By continuing, you agree to our{" "}
            <a
              href="/terms"
              className="text-primary hover:text-primary-dark transition-colors"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="text-primary hover:text-primary-dark transition-colors"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
