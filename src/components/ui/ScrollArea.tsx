"use client";

import React, { useEffect, useRef } from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

export default function ScrollArea({
  children,
  id = null,
}: {
  children: React.ReactNode;
  id?: string | null;
}) {

  return (
    <ScrollAreaPrimitive.Root className="flex flex-col flex-1 max-h-full overflow-hidden">
      <ScrollAreaPrimitive.ScrollAreaViewport className={`flex flex-1 scroll-child-area w-full h-full`} id={id ? id : undefined}>
        {children}
      </ScrollAreaPrimitive.ScrollAreaViewport>
      <ScrollAreaPrimitive.ScrollAreaScrollbar
        className={`bg-gray-200 rounded-md flex select-none touch-none p-0.5 transition-colors duration-[160ms] ease-out data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5`}
        orientation="vertical"
      >
        <ScrollAreaPrimitive.ScrollAreaThumb className="bg-gray-400 flex-1 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[10px] before:min-h-[44px]" />
      </ScrollAreaPrimitive.ScrollAreaScrollbar>
      <ScrollAreaPrimitive.ScrollAreaScrollbar
        className="bg-gray-200 rounded-md flex select-none touch-none p-0.5 transition-colors duration-[160ms] ease-out data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
        orientation="horizontal"
      >
        <ScrollAreaPrimitive.ScrollAreaThumb className="bg-gray-400 flex-1 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[10px] before:min-h-[44px]" />
      </ScrollAreaPrimitive.ScrollAreaScrollbar>
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}