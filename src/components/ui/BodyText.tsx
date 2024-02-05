"use client";

import { cva, VariantProps } from "class-variance-authority";
import { DetailedHTMLProps, HTMLAttributes } from "react";

const bodyStyles = cva("", {
  variants: {
    size: {
      large: "text-[18px] font-normal leading-7",
      medium: "text-[16px] font-normal leading-normal",
      small: "text-[14px] font-normal leading-tight",
      xsmall: "text-[12px] font-normal leading-none",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    size: "medium",
    align: "left",
  },
});

export interface Props
  extends DetailedHTMLProps<
      HTMLAttributes<HTMLHeadingElement>,
      HTMLHeadingElement
    >,
    VariantProps<typeof bodyStyles> {
  moreClasses?: string;
}

export default function BodyText({
  size,
  align,
  moreClasses,
  ...props
}: Props) {
  return (
    <div className={`${bodyStyles({ size, align })} ${moreClasses ?? ""}`} {...props}>
      {props.children}
    </div>
  );
}
