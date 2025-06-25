"use client";
import React, { useId } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useSettings } from "@/context/SettingsContext";

const themeOptions = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

type Theme = "light" | "dark" | "system";

const SettingsModal: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const { theme, setTheme } = useSettings();
  const switchId = useId();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="btn btn-primary">Settings</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card p-0 rounded-xl shadow-2xl z-50 w-full max-w-md border border-border">
          <div className="p-6 flex flex-col gap-6">
            <Dialog.Title className="text-xl font-bold mb-2">
              Settings
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Change your appearance and theme preferences.
            </Dialog.Description>
            <div className="border-b border-border -mx-6" />
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground mb-3 tracking-wide uppercase">
                Appearance
              </h2>
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <label
                    htmlFor={switchId}
                    className="block text-base font-medium cursor-pointer select-none"
                  >
                    Dark Mode
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Toggle dark theme for the app
                  </p>
                </div>
                {/* Custom switch */}
                <span className="relative inline-block w-12 h-7 align-middle">
                  <input
                    id={switchId}
                    type="checkbox"
                    checked={theme === "dark"}
                    onChange={(e) =>
                      setTheme(e.target.checked ? "dark" : "light")
                    }
                    className="sr-only peer"
                    aria-checked={theme === "dark"}
                    aria-label="Toggle dark mode"
                  />
                  <span className="block w-12 h-7 bg-gray-300 dark:bg-gray-700 rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-primary peer-checked:bg-primary" />
                  <span className="absolute left-1 top-1 w-5 h-5 bg-white dark:bg-gray-900 rounded-full shadow transition-transform peer-checked:translate-x-5" />
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-muted-foreground mb-1">
                  Theme
                </span>
                <div className="flex rounded-lg overflow-hidden border border-border bg-muted">
                  {themeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`flex-1 px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        theme === opt.value
                          ? "bg-primary text-white"
                          : "text-text-primary hover:bg-surface"
                      }`}
                      onClick={() => setTheme(opt.value as Theme)}
                      aria-pressed={theme === opt.value}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>
          <Dialog.Close asChild>
            <button
              className="absolute top-3 right-3 text-xl rounded-full p-1 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              aria-label="Close settings"
            >
              ×
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SettingsModal;
