import React, { DetailedHTMLProps, HTMLAttributes, Ref } from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { MdOutlineArrowRight } from "react-icons/md";
import { DropdownMenuItemProps } from "@radix-ui/react-dropdown-menu";
import BodyText from "./BodyText";

export const Dropdown = DropdownMenuPrimitive.Root;
export const DropdownTrigger = DropdownMenuPrimitive.Trigger;

interface DialogProps extends DropdownMenuPrimitive.DropdownMenuContentProps {
  isOpen: boolean;
  zIndex?: number;
}

export const DropdownContent = React.forwardRef(
  (
    { children, isOpen, zIndex = 1, ...props }: DialogProps,
    forwardedRef: Ref<HTMLDivElement>
  ) => {
    return (
      <AnimatePresence>
        {isOpen ? (
          <DropdownMenuPrimitive.Portal forceMount>
            <DropdownMenuPrimitive.Content
              {...props}
              ref={forwardedRef}
              asChild
            >
              <motion.div
                className={`backdrop-blur bg-white/70 shadow-lg rounded z-[${zIndex}] border`}
                initial={{
                  scale: 0.9,
                  opacity: 0.8,
                }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                transition={{ duration: 0.1 }}
                exit={{
                  scale: 0.9,
                  opacity: 0,
                  transition: { duration: 0.05 },
                }}
              >
                {children}
              </motion.div>
            </DropdownMenuPrimitive.Content>
          </DropdownMenuPrimitive.Portal>
        ) : null}
      </AnimatePresence>
    );
  }
);

DropdownContent.displayName = "DropdownMenuContent";

export const DropdownLabel = DropdownMenuPrimitive.Label;
export const DropdownItem = DropdownMenuPrimitive.Item;
export const DropdownGroup = DropdownMenuPrimitive.Group;
export const DropdownRadioGroup = DropdownMenuPrimitive.RadioGroup;
export const DropdownSeparator = DropdownMenuPrimitive.Separator;

export interface StyledDropdownItemProps
  extends React.ForwardRefExoticComponent<
    DropdownMenuItemProps & React.RefAttributes<HTMLDivElement>
  > {}
export function StyledDropdownItem({
  label,
  icon,
  selected = false,
  onClick = () => {},
}: {
  label: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onClick?: Function;
}) {
  return (
    <DropdownMenuPrimitive.Item
      onClick={(e) => onClick()}
      className={`px-2 py-1.5 flex flex-row gap-2 items-center justify-between ${selected ? "bg-gray-200/50" : ""} hover:bg-gray-200/50 focus:bg-gray-200/50 focus:outline-none cursor-pointer rounded text-normal-500 hover:text-loud-900`}
    >
      <div className="flex flex-row gap-2 items-center">
        {icon}
        <BodyText size={"small"}>{label}</BodyText>
      </div>
    </DropdownMenuPrimitive.Item>
  );
}
