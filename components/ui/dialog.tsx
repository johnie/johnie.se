import { XIcon } from "@phosphor-icons/react";
import {
  Close,
  Content,
  Description,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
} from "@radix-ui/react-dialog";
import type * as React from "react";

import { cn } from "@/lib/utils";

const Dialog = Root;

const DialogTrigger = Trigger;

const DialogPortal = Portal;

const DialogOverlay = ({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof Overlay>) => (
  <Overlay
    className={cn(
      "bg-background/80 data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out reduced-transparency:bg-background/95 reduced-transparency:backdrop-blur-none fixed inset-0 z-50 backdrop-blur-xs",
      className
    )}
    {...props}
  />
);

DialogOverlay.displayName = Overlay.displayName;

const DialogContent = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<typeof Content>) => (
  <DialogPortal>
    <DialogOverlay />
    <Content
      className={cn(
        "bg-background data-[state=open]:animate-dialog-in data-[state=closed]:animate-dialog-out fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg sm:rounded-lg md:w-full",
        className
      )}
      {...props}
    >
      {children}
      <Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
        <XIcon size={16} />
        <span className="sr-only">Close</span>
      </Close>
    </Content>
  </DialogPortal>
);

DialogContent.displayName = Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);

DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);

DialogFooter.displayName = "DialogFooter";

const DialogTitle = ({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof Title>) => (
  <Title
    className={cn(
      "text-lg leading-none font-semibold tracking-tight",
      className
    )}
    {...props}
  />
);

DialogTitle.displayName = Title.displayName;

const DialogDescription = ({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof Description>) => (
  <Description
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
);

DialogDescription.displayName = Description.displayName;

export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
