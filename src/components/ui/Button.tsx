"use client";

import { cva, VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import React from "react";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { FadeLoader } from "react-spinners";

const buttonStyles = cva("gap-[6px] text-[14px] font-medium leading-tight flex flex-row items-center transition", {
  variants: {
    intent: {
      primary:
        "cursor-pointer [border:none] bg-[transparent] [background:linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.00)_100%),#272727] shadow-[0px_0px_0px_1px_#5B5B5B,0px_1px_2px_0px_rgba(36,36,36,0.50)] overflow-hidden relative text-sm leading-[20px] font-medium font-label-medium text-white",
      secondary: "bg-button-secondary shadow-[0px_1px_2px_rgba(164,_172,_185,_0.24),_0px_0px_0px_1px_rgba(18,_55,_105,_0.08)] relative overflow-hidden box-border gap-[6px] text-sm text-muted-600 font-label-small relative leading-[20px] font-medium",
      ghost:
        "cursor-pointer [border:none] hover:underline bg-[transparent] overflow-hidden flex flex-row items-center relative text-sm leading-[20px] font-medium font-label-medium text-muted-600",
      danger:
        "bg-button-danger shadow-[0px_1px_2px_rgba(79,17,17,0.4),0px_0px_0px_1px_rgba(228,1,1,0.76)] hover:bg-rose-600 text-white disabled:bg-rose-300 disabled:shadow-[0px_1px_2px_rgba(79,17,17,0.14),0px_0px_0px_1px_rgba(228,1,1,0.24)]",
      warn:
        "cursor-pointer [border:none] hover:underline bg-[transparent] overflow-hidden flex flex-row items-center relative text-sm leading-[20px] font-medium font-label-medium text-red-600",
      success:
        "bg-button-success shadow-[0px_1px_2px_rgba(19,79,17,0.4),0px_0px_0px_1px_rgba(6,228,1,0.76)] hover:bg-green-600 text-white disabled:bg-green-300",
      icon: "text-muted-600",
    },
    rounded: {
      full: "rounded-[96px]",
      default: "rounded-md"
    },
    align: {
      left: "text-left justify-start",
      center: "text-center justify-center",
      right: "text-right justify-end",
    },
    width: {
      full: "w-full",
      auto: "",
    },
    size: {
      large: "py-2 px-2",
      medium: "py-1.5 px-2",
      small: "py-1 px-2",
      smallSquare: "p-1",
    },
  },
  defaultVariants: {
    intent: "primary",
    align: "center",
    width: "auto",
    size: "medium",
    rounded: "default"
  },
});

export interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
  VariantProps<typeof buttonStyles> {
  iconleft?: any;
  iconright?: any;
  isLoading?: boolean;
}

const Button = React.forwardRef(
  (
    {
      iconleft: IconLeft = null,
      iconright: IconRight = null,
      isLoading = false,
      intent = "primary",
      align,
      width,
      size,
      rounded,
      ...props
    }: Props,
    ref
  ) => {
    let tempProps = { ...props };
    delete tempProps.children;

    let iconClasses = `relative w-5 h-5 overflow-hidden shrink-0 ${intent == "icon"
      ? "text-normal-500"
      : intent != "secondary" && intent != "ghost"
        ? "text-white"
        : "text-normal-500"
      }`;

    return (
      <motion.button
        ref={ref}
        className={buttonStyles({ intent, align, width, size, rounded })}
        whileTap={{
          transition: { duration: 0.1 },
        }}
        {...(tempProps as any)}
      >
        {isLoading ? (
          <div className="relative pl-2">
            <FadeLoader
              height={5}
              width={2}
              radius={1}
              margin={-11}
              cssOverride={{
                height: "16px",
                width: "12px",
                top: 17,
                left: "10px",
              }}
              color={intent == "primary" ? "#FFF" : "#000"}
            />
          </div>
        ) : null}
        {IconLeft ? <IconLeft className={iconClasses} /> : null}
        {props.children}
        {IconRight ? <IconRight className={iconClasses} /> : null}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
