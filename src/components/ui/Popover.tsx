"use client";

import React, { Ref } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { AnimatePresence, motion } from "framer-motion";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.PopoverAnchor;
interface PopoverProps extends PopoverPrimitive.PopoverContentProps {
  isOpen: boolean;
  zIndex?: number;
  padding?: number;
  transitionDuration?: number;
  exitDuration?: number;
}

export const PopoverContent = React.forwardRef(
  (
    {
      children,
      side,
      isOpen,
      transitionDuration = 0.1,
      exitDuration = 0.05,
      zIndex = 1,
      padding = 1,
      ...props
    }: PopoverProps,
    forwardedRef: Ref<HTMLDivElement>
  ) => (
    <AnimatePresence>
      {isOpen ? (
        <PopoverPrimitive.Portal forceMount>
          <PopoverPrimitive.Content {...props} ref={forwardedRef}>
            <motion.div
              className={`backdrop-blur-lg bg-white/90 p-${padding} shadow-lg rounded-lg z-[${zIndex}] border`}
              initial={{
                scale: 0.9,
                opacity: 0.8,
              }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: transitionDuration }}
              exit={{
                scale: 0.9,
                opacity: 0,
                transition: { duration: exitDuration },
              }}
            >
              {children}
            </motion.div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      ) : null}
    </AnimatePresence>
  )
);

PopoverContent.displayName = "PopoverContent";
