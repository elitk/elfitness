'use client'
import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@/components/ui';

const SettingsModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="btn btn-primary">Settings</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card p-6 rounded-lg shadow-lg z-50 w-full max-w-md">
          <Dialog.Title asChild>
            <VisuallyHidden>Settings</VisuallyHidden>
          </Dialog.Title>
          <form className="flex flex-col gap-4">
            {/* Example setting */}
            <label className="flex flex-col gap-1">
              <span className="text-sm">Dark Mode</span>
              <input type="checkbox" className="toggle" />
            </label>
            <button type="submit" className="btn btn-primary mt-2">Save</button>
          </form>
          <Dialog.Close asChild>
            <button className="absolute top-2 right-2 text-xl">×</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SettingsModal; 