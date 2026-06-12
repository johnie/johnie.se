"use client";

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
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-background/80 backdrop-blur-xs data-[state=closed]:animate-out data-[state=open]:animate-in",
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
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in sm:rounded-lg md:w-full",
        className
      )}
      {...props}
    >
      {children}
      <Close className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
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
      "font-semibold text-lg leading-none tracking-tight",
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
