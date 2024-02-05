"use client";

import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { motion } from "framer-motion";

interface TooltipProps extends TooltipPrimitive.TooltipProps {
  content: React.ReactNode;
  align?: "center" | "start" | "end" | undefined;
  side?: "top" | "right" | "bottom" | "left" | undefined;
}

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <TooltipPrimitive.Provider>{children}</TooltipPrimitive.Provider>;
}

export function Tooltip({
  children,
  content,
  open,
  defaultOpen = false,
  onOpenChange,
  delayDuration = 0,
  disableHoverableContent,
  align = "center",
  side = "top",
  ...props
}: TooltipProps) {
  return (
    <TooltipPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      delayDuration={delayDuration}
      disableHoverableContent={disableHoverableContent}
    >
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Content
        className="bg-white p-2 text-slate-900 shadow-lg rounded-lg z-[9999]"
        side={side}
        align={align}
        asChild
        {...props}
      >
        <motion.div
          initial={{ opacity: 0, y: 5, size: 0.8 }}
          animate={{ opacity: 1, y: 0, size: 1 }}
          transition={{ duration: 0.15}}
        >
          {content}
          <TooltipPrimitive.Arrow
            className="fill-white"
            width={11}
            height={5}
          />
        </motion.div>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Root>
  );
}
