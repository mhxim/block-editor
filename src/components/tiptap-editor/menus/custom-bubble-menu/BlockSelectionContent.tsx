import { Editor } from "@tiptap/core";
import { useMemo, useState } from "react";
import { CgCheck, CgChevronDown } from "react-icons/cg";
import { RiH1, RiH2, RiH3 } from "react-icons/ri";
import { BiText } from "react-icons/bi";
import { FaListOl, FaListUl } from "react-icons/fa";
import { DropdownItem } from "@/components/ui/Dropdown";

export const BlockSelectionContent = ({ editor }: { editor: Editor }) => {
  const turnIntoBlocks = useMemo(() => {
    return [
      {
        label: "Text",
        command: () => editor.chain().focus().setParagraph().run(),
        isActive:
          !editor.isActive("bulletList") &&
          !editor.isActive("orderedList") &&
          !editor.isActive("heading"),
        Icon: BiText,
      },
      {
        label: "Heading 1",
        command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: editor.isActive("heading", { level: 1 }),
        Icon: RiH1,
      },
      {
        label: "Heading 2",
        command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: editor.isActive("heading", { level: 2 }),
        Icon: RiH2,
      },
      {
        label: "Heading 3",
        command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        isActive: editor.isActive("heading", { level: 3 }),
        Icon: RiH3,
      },
      {
        label: "Numbered list",
        command: () => editor.chain().focus().toggleOrderedList().run(),
        isActive: editor.isActive("orderedList"),
        Icon: RiH3,
      },
      {
        label: "Bulleted list",
        command: () => editor.chain().focus().toggleBulletList().run(),
        isActive: editor.isActive("bulletList"),
        Icon: RiH3,
      },
    ];
  }, [editor]);

  return (
    <div className="flex flex-col px-2 py-1 w-52">
      <div className="py-1 px-2 text-xs text-gray-500 uppercase">Turn into</div>
      {turnIntoBlocks.map((block, i) => {
        return (
          <DropdownItem
            key={i}
            className={`flex items-center px-2 py-1 rounded justify-between focus:bg-gray-100 hover:bg-gray-100 focus:outline-none cursor-pointer text-gray-800`}
            onClick={() => block.command()}
          >
            <div className="flex items-center align-middle">
              <block.Icon />
              <span className="ml-2">{block.label}</span>
            </div>
            {block.isActive && <CgCheck />}
          </DropdownItem>
        );
      })}
    </div>
  );
};
