"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className='group toaster'
      icons={{
        success: (
          <CircleCheckIcon className='bg-green-50 size-4 text-green-500' />
        ),
        info: <InfoIcon className='bg-blue-50 size-4 text-blue-500' />,
        warning: (
          <TriangleAlertIcon className='bg-yellow-50 size-4 text-yellow-500' />
        ),
        error: <OctagonXIcon className='bg-red-50 size-4 text-red-500' />,
        loading: (
          <Loader2Icon className='bg-green-50 size-4 text-green-500 animate-spin' />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
