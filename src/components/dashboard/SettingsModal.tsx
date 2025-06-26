"use client";
import React, { useRef, useEffect } from "react";
import { useSettings } from "@/context/SettingsContext";

const SettingsModal: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const { theme, setTheme } = useSettings();
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Focus trap
  useEffect(() => {
    if (!open || !modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length) focusable[0].focus();
  }, [open]);

  // Restore focus to trigger
  useEffect(() => {
    if (!open && triggerRef.current) triggerRef.current.focus();
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        className="btn btn-primary"
        onClick={() => {
          console.log("Open button clicked");
          setOpen(true);
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="settings-modal"
      >
        Settings
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          aria-modal="true"
          role="dialog"
          id="settings-modal"
        >
          <div
            ref={modalRef}
            className="bg-card rounded-xl shadow-2xl w-full max-w-md border border-border p-6 relative animate-fadeIn"
            tabIndex={-1}
          >
            <h2 className="text-xl font-bold mb-2">Settings</h2>
            <p className="sr-only">
              Change your appearance and theme preferences.
            </p>
            <div className="border-b border-border -mx-6 mb-6" />
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 tracking-wide uppercase">
                Appearance
              </h3>
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <label
                    htmlFor="dark-mode-switch"
                    className="block text-base font-medium cursor-pointer select-none"
                  >
                    Dark Mode
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Toggle dark theme for the app
                  </p>
                </div>
                {/* Styled Tailwind switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={theme === "dark"}
                  onClick={() => {
                    setTheme(theme);
                  }}
                  className={`
                    relative inline-flex h-7 w-12 items-center rounded-full transition-colors
                    focus:outline-none focus:ring-2 focus:ring-primary/50
                    ${theme === "dark" ? "bg-primary" : "bg-gray-300"}
                  `}
                >
                  <span
                    className={`
                      inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform
                      ${theme === "dark" ? "translate-x-5" : "translate-x-1"}
                    `}
                  />
                  <span className="sr-only">Toggle dark mode</span>
                </button>
              </div>
            </section>
            <button
              className="absolute top-3 right-3 text-xl rounded-full p-1 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              aria-label="Close settings"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsModal;
