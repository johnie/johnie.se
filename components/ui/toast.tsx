import { Toast } from "@base-ui/react/toast";
import {
  CheckCircleIcon,
  InfoIcon,
  SpinnerGapIcon,
  WarningCircleIcon,
  XCircleIcon,
  XIcon,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

export const toast = Toast.createToastManager();

const ToastStatusIcon = ({ type }: { type?: string }) => {
  const className = "mt-0.5 size-5 shrink-0";

  switch (type) {
    case "success": {
      return (
        <CheckCircleIcon
          aria-hidden="true"
          className={cn(className, "text-emerald-400")}
        />
      );
    }

    case "info": {
      return (
        <InfoIcon
          aria-hidden="true"
          className={cn(className, "text-sky-400")}
        />
      );
    }

    case "warning": {
      return (
        <WarningCircleIcon
          aria-hidden="true"
          className={cn(className, "text-amber-400")}
        />
      );
    }

    case "error": {
      return (
        <XCircleIcon
          aria-hidden="true"
          className={cn(className, "text-red-400")}
        />
      );
    }

    case "loading": {
      return (
        <SpinnerGapIcon
          aria-hidden="true"
          className={cn(
            className,
            "animate-spin text-neutral-400 motion-reduce:animate-none"
          )}
        />
      );
    }

    default: {
      return null;
    }
  }
};

const ToastList = () => {
  const { toasts } = Toast.useToastManager();

  return (
    <Toast.Portal>
      <Toast.Viewport
        aria-label="Notifications"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex max-h-dvh flex-col gap-2 overflow-y-auto p-4 sm:inset-x-auto sm:right-0 sm:w-96"
      >
        {toasts.map((toastItem) => (
          <Toast.Root
            className="pointer-events-auto relative flex w-full items-start gap-3 rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-neutral-100 shadow-lg transition-[opacity,translate] duration-200 data-[ending-style]:translate-y-2 data-[ending-style]:opacity-0 data-[starting-style]:translate-y-2 data-[starting-style]:opacity-0 data-[swiping]:translate-x-[var(--toast-swipe-movement-x)] data-[swiping]:translate-y-[var(--toast-swipe-movement-y)] data-[swiping]:transition-none motion-reduce:transition-none"
            key={toastItem.id}
            toast={toastItem}
          >
            <ToastStatusIcon type={toastItem.type} />
            <Toast.Content className="flex min-w-0 flex-1 flex-col gap-1">
              {toastItem.title !== undefined && toastItem.title !== null && (
                <Toast.Title className="text-sm font-medium text-neutral-100" />
              )}
              {toastItem.description !== undefined &&
                toastItem.description !== null && (
                  <Toast.Description className="text-sm text-neutral-400" />
                )}
            </Toast.Content>
            {toastItem.actionProps && (
              <Toast.Action className="inline-flex shrink-0 items-center justify-center rounded-md px-2.5 py-1.5 text-xs font-medium text-neutral-100 transition-colors hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:outline-none" />
            )}
            <Toast.Close
              aria-label="Dismiss notification"
              className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-100 focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:outline-none"
            >
              <XIcon aria-hidden="true" size={16} />
            </Toast.Close>
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  );
};

export const Toaster = () => (
  <Toast.Provider limit={4} timeout={5000} toastManager={toast}>
    <ToastList />
  </Toast.Provider>
);
